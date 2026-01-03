import { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'

import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import type { BaseModalProps } from '@/modules/modal/types/base-modal-props'

import Search from '@/shared/components/search/search'
import {
    buildSearchEngine,
    runSearch,
    type SearchConfig,
} from '@/shared/components/search/engine'

export type ListSelectItem = {
    id: string
    name: string
    price?: number | null
    image?: string | null
    next?: boolean
}

export type ListSelectModalProps = BaseModalProps & {
    title: string
    items: ListSelectItem[]
    onSelect: (item: ListSelectItem) => void
    primaryTitle?: string
    searchPlaceholder?: string
    searchConfig?: SearchConfig
    closeOnSelect?: boolean
}

const ITEM_HEIGHT = 71
const THUMB_SIZE = 55

export default function ListSelectModal({
    title,
    items,
    onSelect,
    onClose,
    primaryTitle = 'Выбрать',
    searchPlaceholder = 'Поиск по названию',
    searchConfig,
    closeOnSelect = true,
}: ListSelectModalProps) {
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const emptyText = query.trim().length > 0 ? 'Ничего не найдено' : 'Товаров пока нет'

    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>{emptyText}</Text>
        </View>
    )

    const engine = useMemo(() => {
        return buildSearchEngine(items, {
            getId: i => i.id,
            getText: i => i.name,
        })
    }, [items])

    const filtered = useMemo(() => {
        return runSearch(engine, query, {
            minQueryLength: 1,
            returnAllWhenQueryTooShort: true,
            limit: 200,
            ...searchConfig,
        })
    }, [engine, query, searchConfig])

    const itemsById = useMemo(() => {
        const map = new Map<string, ListSelectItem>()
        for (const it of items) map.set(it.id, it)
        return map
    }, [items])

    const pick = (item: ListSelectItem) => {
        onSelect(item)
        if (closeOnSelect) onClose?.()
    }

    const handlePrimaryPress = () => {
        if (!selectedId) return
        const selected = itemsById.get(selectedId)
        if (!selected) return
        pick(selected)
    }

    useEffect(() => {
        if (!selectedId) return
        const stillVisible = filtered.some(i => i.id === selectedId)
        if (!stillVisible) setSelectedId(null)
    }, [filtered, selectedId])

    const primaryDisabled = !selectedId

    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <View style={styles.searchWrap}>
                <Search
                    value={query}
                    onChangeText={setQuery}
                    placeholder={searchPlaceholder}
                />
            </View>

            <View style={styles.listWrap}>
                <FlatList
                    data={filtered}
                    keyExtractor={i => i.id}
                    renderItem={({ item, index }) => {
                        const isSelected = item.id === selectedId
                        const isLast = index === filtered.length - 1

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    isSelected && !item.next && styles.itemSelected,
                                    isLast && styles.itemLast,
                                ]}
                                onPress={() => {
                                    if (item.next) {
                                        pick(item)
                                        return
                                    }
                                    setSelectedId(item.id)
                                }}
                                activeOpacity={0.7}
                            >
                                {item.image ? (
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.thumb}
                                    />
                                ) : (
                                    <View
                                        style={[styles.thumb, styles.thumbPlaceholder]}
                                    />
                                )}

                                <View style={styles.itemText}>
                                    <Text style={styles.name} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    {item.price != null && (
                                        <Text style={styles.price}>{item.price} ₽</Text>
                                    )}
                                </View>

                                {item.next ? <Text style={styles.chevron}>›</Text> : null}
                            </TouchableOpacity>
                        )
                    }}
                    style={styles.list}
                    contentContainerStyle={[
                        styles.listContent,
                        filtered.length === 0 && styles.listContentEmpty,
                    ]}
                    ListEmptyComponent={renderEmpty}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                />
            </View>

            <ModalFooter
                primaryTitle={primaryTitle}
                onPrimaryPress={handlePrimaryPress}
                primaryDisabled={primaryDisabled}
            />
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: { paddingBottom: 0 },

    searchWrap: { paddingHorizontal: 15, paddingBottom: 0 },

    listWrap: { height: ITEM_HEIGHT * 3, marginBottom: 12 },
    list: { flex: 1 },
    listContent: { paddingVertical: 0 },

    item: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    itemLast: { borderBottomWidth: 0 },
    itemSelected: { backgroundColor: 'rgba(255, 209, 232, 1)' },

    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 15,
        marginRight: 14,
    },
    thumbPlaceholder: {
        backgroundColor: colors.mainPink,
        opacity: 0.6,
    },

    itemText: { flex: 1, gap: 4 },
    name: {
        fontSize: 16,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
    price: {
        fontSize: 14,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        opacity: 0.85,
    },

    chevron: {
        fontSize: 26,
        lineHeight: 26,
        color: colors.mainGray,
        marginLeft: 10,
        marginTop: -2,
    },

    listContentEmpty: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWrap: { alignItems: 'center', paddingHorizontal: 20 },
    emptyTitle: { fontSize: 16, color: colors.mainGray },
})
