import { Ionicons } from '@expo/vector-icons'
import { useMemo, useRef } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { PlannerListItem } from '@/shared/types/types'
import { findPastScrollIndex, findUpcomingScrollIndex } from '../../utils/planner-tasks'
import TaskRow, { ROW_HEIGHT } from './task-row'

const MAX_HEIGHT = 464

type Variant = 'upcoming' | 'past'
type Item = PlannerListItem & { completed: boolean }

type Props = {
    title: string
    expanded: boolean
    variant: Variant
    selectedDate: string
    items: Item[]
    onToggleExpanded: () => void
    onToggleCompleted: (id: string) => void
    onPressItem: (item: PlannerListItem) => void
}

function clampIndex(index: number, len: number) {
    if (!len) return 0
    if (!Number.isFinite(index)) return 0
    return Math.max(0, Math.min(index, len - 1))
}

export default function TasksSection({
    title,
    expanded,
    variant,
    selectedDate,
    items,
    onToggleExpanded,
    onToggleCompleted,
    onPressItem,
}: Props) {
    const styles = useStyles()
    const listRef = useRef<FlatList<Item>>(null)

    const initialIndex = useMemo(() => {
        if (!items.length) return 0
        const raw =
            variant === 'upcoming'
                ? findUpcomingScrollIndex(items as any, selectedDate)
                : findPastScrollIndex(items as any, selectedDate)

        return clampIndex(raw, items.length)
    }, [items, selectedDate, variant])

    return (
        <View style={styles.card}>
            <Pressable onPress={onToggleExpanded} style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} />
            </Pressable>

            {expanded && (
                <View style={styles.listWrap}>
                    <FlatList<Item>
                        ref={listRef}
                        data={items}
                        keyExtractor={it => it.id}
                        renderItem={({ item }) => (
                            <TaskRow
                                item={item}
                                isPast={variant === 'past'}
                                onToggle={() => onToggleCompleted(item.id)}
                                onPress={() => onPressItem(item)}
                            />
                        )}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                        style={{ maxHeight: MAX_HEIGHT }}
                        contentContainerStyle={styles.listContent}
                        initialScrollIndex={items.length ? initialIndex : undefined}
                        getItemLayout={(_, index) => ({
                            length: ROW_HEIGHT,
                            offset: ROW_HEIGHT * index,
                            index,
                        })}
                        onScrollToIndexFailed={info => {
                            const offset = info.averageItemLength * info.index
                            requestAnimationFrame(() => {
                                listRef.current?.scrollToOffset({
                                    offset,
                                    animated: false,
                                })
                            })
                        }}
                    />
                </View>
            )}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingTop: 14,
            paddingBottom: 10,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 8,
        },
        headerText: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 16,
            color: theme.colors.text,
        },
        listWrap: {
            paddingTop: 4,
        },
        listContent: {
            paddingRight: 6,
        },
    }),
)
