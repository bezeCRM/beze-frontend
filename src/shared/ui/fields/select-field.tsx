import { Icon } from '../icon/icon'
import { useModalStore } from '@/modules/modal'
import { useCategoryStore } from '@/modules/products/store/categories.store'
import { Category } from '@/shared/types/types'
import { useMemo, useRef, useState } from 'react'
import {
    FlatList,
    LayoutRectangle,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native'
import SectionCard from '../section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

type Props = {
    label: string
    options: Category[]
    selectedId?: string | number | null
    onSelect?: (opt: Category) => void
    placeholder?: string
    error?: boolean
    addCategoryEnabled?: boolean
}

export default function SelectField({
    label,
    options,
    selectedId = null,
    onSelect,
    placeholder = 'Выберите категорию',
    error,
    addCategoryEnabled = true,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const { height: screenH } = useWindowDimensions()
    const [openSelect, setOpenSelect] = useState(false)
    const [anchor, setAnchor] = useState<LayoutRectangle | null>(null)

    const selected = useMemo(
        () => options.find(o => String(o.id) === String(selectedId)) || null,
        [options, selectedId],
    )

    const anchorRef = useRef<View>(null)

    function openDropdown() {
        anchorRef.current?.measureInWindow((x, y, w, h) => {
            setAnchor({ x, y, width: w, height: h })
            setOpenSelect(true)
        })
    }

    function handleSelect(opt: Category) {
        onSelect?.(opt)
        setOpenSelect(false)
    }

    const { open } = useModalStore()
    const addCategory = useCategoryStore(s => s.addCategory)
    const setActiveCategory = useCategoryStore(s => s.setActiveCategory)
    const hasCategory = useCategoryStore(s => s.hasCategory)

    function handleAddCategory() {
        setOpenSelect(false)
        open('form', {
            title: 'Добавление категории',
            placeholder: 'Введите название',
            buttonTitle: 'Добавить категорию',
            validate: (name: string) => {
                if (hasCategory(name)) return 'Такая категория уже существует'
                return null
            },
            onSubmit: (name: string) => {
                const id = addCategory(name)
                setActiveCategory(id)
                open('status', {
                    title: 'Добавление категории',
                    message: 'Категория успешно добавлена!',
                    success: true,
                })
            },
        })
    }

    const MAX_DROPDOWN_H = 260
    const OPTION_H = 40
    const SEP_H = StyleSheet.hairlineWidth

    const dropdownPos = useMemo(() => {
        if (!anchor) return { top: 0, left: 0, width: 0 }

        const count = options.length
        const hasAdd = addCategoryEnabled

        // высота контента:
        // - опции: count * 40
        // - разделители внутри FlatList: (count-1) * hairline
        // - кнопка "Добавить категорию": 40 (если включена)
        // - разделитель после кнопки: hairline (если есть кнопка и есть хотя бы 1 опция)
        const listH = count * OPTION_H
        const listSeps = Math.max(0, count - 1) * SEP_H
        const addH = hasAdd ? OPTION_H : 0
        const addSepH = hasAdd && count > 0 ? SEP_H : 0

        const desiredH = Math.min(MAX_DROPDOWN_H, listH + listSeps + addH + addSepH)

        const spaceBelow = screenH - (anchor.y + anchor.height)
        const openUp = spaceBelow < desiredH

        const top = openUp
            ? Math.max(8, anchor.y - desiredH - 8)
            : anchor.y + anchor.height + 4

        return { top, left: anchor.x, width: anchor.width }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchor, screenH, options.length, addCategoryEnabled])

    return (
        <SectionCard title={label}>
            <View ref={anchorRef} collapsable={false}>
                <TouchableOpacity
                    style={[styles.field, error && styles.fieldError]}
                    onPress={openDropdown}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.value, !selected && styles.placeholder]}>
                        {selected ? selected.name : placeholder}
                    </Text>
                    <Icon
                        name="arrow-icon"
                        rotateDeg={-90}
                        size={14}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                visible={openSelect}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => setOpenSelect(false)}
            >
                <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setOpenSelect(false)}
                    />

                    {anchor && (
                        <View
                            style={[
                                styles.dropdown,
                                {
                                    top: dropdownPos.top,
                                    left: dropdownPos.left,
                                    width: dropdownPos.width,
                                    maxHeight: 260,
                                },
                            ]}
                        >
                            {/* кнопка "Добавить категорию" */}
                            {addCategoryEnabled && (
                                <Pressable
                                    onPress={handleAddCategory}
                                    style={({ pressed }) => [
                                        styles.option,
                                        pressed && { backgroundColor: '#f5f5f5' },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            styles.addCategoryText,
                                        ]}
                                    >
                                        Добавить категорию
                                    </Text>
                                </Pressable>
                            )}

                            {/* разделитель должен быть только если есть кнопка и есть список */}
                            {addCategoryEnabled && options.length > 0 && (
                                <View style={styles.sep} />
                            )}

                            {/* список категорий */}
                            <FlatList
                                data={options}
                                keyExtractor={it => String(it.id)}
                                renderItem={({ item }) => {
                                    const active =
                                        selected &&
                                        String(selected.id) === String(item.id)
                                    return (
                                        <Pressable
                                            onPress={() => handleSelect(item)}
                                            style={({ pressed }) => [
                                                styles.option,
                                                active && styles.optionActive,
                                                pressed && styles.optionPressed,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    active && styles.optionTextActive,
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                        </Pressable>
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={styles.sep} />}
                                keyboardShouldPersistTaps="handled"
                            />
                        </View>
                    )}
                </View>
            </Modal>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        field: {
            backgroundColor: theme.colors.surface,
            height: 40,
            borderRadius: 15,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        fieldError: { borderColor: theme.colors.danger },
        value: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        placeholder: {
            color: theme.colors.textMuted,
        },

        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.1)',
        },
        dropdown: {
            position: 'absolute',
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
        },
        option: {
            height: 40,
            paddingHorizontal: 15,
            justifyContent: 'center',
        },
        optionActive: { backgroundColor: theme.colors.brand },
        optionPressed: { backgroundColor: theme.colors.surface },
        optionText: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        optionTextActive: {
            color: theme.colors.surface,
        },
        addCategoryText: {
            color: theme.colors.brand,
        },
        sep: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.border,
            marginHorizontal: 10,
        },
    }),
)
