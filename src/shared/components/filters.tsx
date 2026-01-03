import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { theme } from '@/shared/theme'
import { Category } from '../types/types'
import { useEffect } from 'react'
import { useAutoScroll } from '@/shared/hooks/useAutoScroll'

type FiltersProps = {
    items: Category[]
    activeId: string | null
    onSelect: (item: Category) => void
    onAddCategory?: () => void
    showAllButton?: boolean
    screenTitle: 'товары' | 'заказы'
}
type AddItem = { id: '__add__'; name: string }
type AllItem = { id: 'all'; name: string }
type FilterListItem = Category | AddItem | AllItem

export default function Filters({
    items,
    activeId,
    onSelect,
    onAddCategory,
    showAllButton = false,
    screenTitle,
}: FiltersProps) {
    let data: FilterListItem[] = [...items]

    if (showAllButton) data = [{ id: 'all', name: `Все ${screenTitle}` }, ...data]
    if (onAddCategory) data = [...data, { id: '__add__', name: 'Добавить категорию' }]

    const { listRef, onContentSizeChange, scrollToItem } = useAutoScroll<FilterListItem>({
        itemsLength: items.length,
        enabled: Boolean(onAddCategory),
    })

    useEffect(() => {
        if (!activeId) return
        const index = data.findIndex(el => el.id === activeId)
        if (index !== -1) {
            scrollToItem(index)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId])

    return (
        <View style={styles.wrapper}>
            <FlatList<FilterListItem>
                ref={listRef}
                onContentSizeChange={onContentSizeChange}
                horizontal
                data={data}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                renderItem={({ item }) => {
                    if (item.id === '__add__') {
                        return (
                            <TouchableOpacity
                                style={[styles.chip, styles.addChip]}
                                onPress={onAddCategory}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.chipText, styles.addChipText]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    const isActive =
                        (item.id === 'all' && activeId === null) ||
                        (item.id !== 'all' && activeId === item.id)

                    return (
                        <TouchableOpacity
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => {
                                if (item.id === 'all') {
                                    onSelect({ id: 'all', name: `Все ${screenTitle}` })
                                } else {
                                    onSelect(item)
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    isActive && styles.chipTextActive,
                                ]}
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 20,
    },
    content: {},
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.backgroundWhite,
    },
    chipActive: {
        borderColor: theme.colors.mainPink,
    },
    chipText: {
        fontSize: 14,
        fontFamily: 'Epilogue-Regular',
        color: theme.colors.mainGray,
    },
    chipTextActive: {
        color: theme.colors.mainPink,
        fontFamily: 'Epilogue-SemiBold',
    },
    addChip: {
        borderColor: theme.colors.mainBlue,
    },
    addChipText: {
        color: theme.colors.mainBlue,
        fontFamily: 'Epilogue-SemiBold',
    },
})
