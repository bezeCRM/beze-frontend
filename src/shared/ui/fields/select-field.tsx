import SelectIcon from '@/assets/images/select-icon.svg'
import { useModalStore } from '@/modules/modal'
import { useCategoryStore } from '@/shared/store/categories.store'
import { theme } from '@/shared/theme'
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

type Props = {
    label: string
    options: Category[]
    selectedId?: string | number | null
    onSelect?: (opt: Category) => void
    placeholder?: string
    error?: boolean
}

export default function SelectField({
    label,
    options,
    selectedId = null,
    onSelect,
    placeholder = 'Выберите категорию',
    error,
}: Props) {
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

    const dropdownPos = useMemo(() => {
        if (!anchor) return { top: 0, left: 0, width: 0, openUp: false }
        const spaceBelow = screenH - (anchor.y + anchor.height)
        const desiredH = Math.min(260, options.length * 48 + 8)
        const openUp = spaceBelow < desiredH
        const top = openUp
            ? Math.max(8, anchor.y - desiredH - 8)
            : anchor.y + anchor.height + 4
        return { top, left: anchor.x, width: anchor.width, openUp }
    }, [anchor, screenH, options.length])

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
                    <SelectIcon width={14} height={8} />
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
                            <Pressable
                                onPress={handleAddCategory}
                                style={({ pressed }) => [
                                    styles.option,
                                    pressed && { backgroundColor: '#f5f5f5' },
                                ]}
                            >
                                <Text style={[styles.optionText, styles.addCategoryText]}>
                                    Добавить категорию
                                </Text>
                            </Pressable>

                            <View style={styles.sep} />

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

const { colors } = theme

const styles = StyleSheet.create({
    field: {
        backgroundColor: colors.mainWhite,
        height: 40,
        borderRadius: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.lineGray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldError: { borderColor: colors.errorRed },
    value: {
        fontSize: 14,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    placeholder: {
        color: colors.mainGray,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: colors.mainWhite,
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
    optionActive: { backgroundColor: colors.mainPink },
    optionPressed: { backgroundColor: colors.mainWhite },
    optionText: {
        fontSize: 14,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    optionTextActive: {
        color: colors.mainWhite,
    },
    addCategoryText: {
        color: colors.mainPink,
    },
    sep: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.lineGray,
        marginHorizontal: 10,
    },
})
