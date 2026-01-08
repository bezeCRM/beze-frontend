import SelectIcon from '@/assets/images/select-icon-white.svg'
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
import { theme } from '@/shared/theme'

type Option<T extends string> = { id: T; name: string }

type Props<T extends string> = {
    value: T
    options: Option<T>[]
    backgroundColor: string
    onSelect: (v: T) => void
}

export default function PillSelect<T extends string>({
    value,
    options,
    backgroundColor,
    onSelect,
}: Props<T>) {
    const { height: screenH } = useWindowDimensions()
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState<LayoutRectangle | null>(null)
    const anchorRef = useRef<View>(null)

    const selected = useMemo(
        () => options.find(o => o.id === value) ?? null,
        [options, value],
    )

    function openDropdown() {
        anchorRef.current?.measureInWindow((x, y, w, h) => {
            setAnchor({ x, y, width: w, height: h })
            setOpen(true)
        })
    }

    function handleSelect(opt: Option<T>) {
        onSelect(opt.id)
        setOpen(false)
    }

    const dropdownPos = useMemo(() => {
        if (!anchor) return { top: 0, left: 0, width: 0 }
        const desiredH = Math.min(260, options.length * 40 + 8)
        const spaceBelow = screenH - (anchor.y + anchor.height)
        const openUp = spaceBelow < desiredH
        const top = openUp
            ? Math.max(8, anchor.y - desiredH - 8)
            : anchor.y + anchor.height + 6
        return { top, left: anchor.x, width: anchor.width }
    }, [anchor, screenH, options.length])

    return (
        <>
            <View ref={anchorRef} collapsable={false}>
                <TouchableOpacity
                    style={[styles.pill, { backgroundColor }]}
                    onPress={openDropdown}
                    activeOpacity={0.85}
                >
                    <Text style={styles.pillText} numberOfLines={1}>
                        {selected?.name ?? ''}
                    </Text>
                    <SelectIcon
                        width={12}
                        height={7}
                        color={theme.colors.mainWhite as any}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                visible={open}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => setOpen(false)}
            >
                <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                    <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

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
                            <FlatList
                                data={options}
                                keyExtractor={it => it.id}
                                renderItem={({ item }) => {
                                    const active = item.id === value
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
        </>
    )
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 999,
    },
    pillText: {
        color: theme.colors.mainWhite,
        fontSize: 14,
        fontFamily: 'Epilogue-Semibold',
        lineHeight: 14,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: theme.colors.mainWhite,
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
    optionActive: { backgroundColor: theme.colors.mainPink },
    optionPressed: { backgroundColor: theme.colors.mainWhite },
    optionText: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    optionTextActive: { color: theme.colors.mainWhite },
    sep: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.lineGray,
        marginHorizontal: 10,
    },
})
