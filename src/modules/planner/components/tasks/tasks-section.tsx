import { Ionicons } from '@expo/vector-icons'
import { useEffect, useMemo, useRef } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { PlannerListItem } from '@/shared/types/types'
import { findPastScrollIndex, findUpcomingScrollIndex } from '../../utils/planner-tasks'
import TaskRow, { ROW_HEIGHT } from './task-row'
import { useTheme } from '@/shared/theme/useTheme'
import { useActionSheet } from '@expo/react-native-action-sheet'

const MAX_CARD_HEIGHT = 420
const ROW_GAP = 20
const ITEM_LAYOUT_HEIGHT = ROW_HEIGHT + ROW_GAP

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
    onDeleteTask: (taskId: string) => void
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
    onDeleteTask,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const listRef = useRef<FlatList<Item>>(null)

    // удаление задачи / переход к заказу
    const { showActionSheetWithOptions } = useActionSheet()

    const openTaskActions = (item: PlannerListItem) => {
        if (item.kind === 'manual') {
            const options = ['Удалить', 'Отмена']
            showActionSheetWithOptions(
                {
                    title: 'Действия с задачей',
                    options,
                    cancelButtonIndex: 1,
                    destructiveButtonIndex: 0,
                },
                buttonIndex => {
                    if (buttonIndex === 0) onDeleteTask(item.taskId ?? item.id)
                },
            )
            return
        }

        if (item.kind === 'order') {
            const options = ['Перейти к заказу', 'Отмена']
            showActionSheetWithOptions(
                {
                    title: 'Действия с заказом',
                    options,
                    cancelButtonIndex: 1,
                },
                buttonIndex => {
                    if (buttonIndex === 0) onPressItem(item)
                },
            )
        }
    }

    const targetIndex = useMemo(() => {
        if (!items.length) return 0

        const raw =
            variant === 'upcoming'
                ? findUpcomingScrollIndex(items as any, selectedDate)
                : findPastScrollIndex(items as any, selectedDate)

        return clampIndex(raw, items.length)
    }, [items, selectedDate, variant])

    useEffect(() => {
        if (!expanded) return
        if (!items.length) return

        const raf = requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
                index: targetIndex,
                animated: false,
                viewPosition: 0,
            })
        })

        return () => cancelAnimationFrame(raf)
    }, [expanded, items.length, targetIndex])

    return (
        <View style={[styles.card, expanded && styles.cardExpanded]}>
            <Pressable onPress={onToggleExpanded} style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.text}
                />
            </Pressable>

            {expanded && (
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
                            onLongPress={() => openTaskActions(item)}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: ROW_GAP }} />}
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    getItemLayout={(_, index) => ({
                        length: ITEM_LAYOUT_HEIGHT,
                        offset: ITEM_LAYOUT_HEIGHT * index,
                        index,
                    })}
                    onScrollToIndexFailed={info => {
                        const offset = ITEM_LAYOUT_HEIGHT * info.index
                        requestAnimationFrame(() => {
                            listRef.current?.scrollToOffset({
                                offset,
                                animated: false,
                            })
                        })
                    }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Задач пока нет</Text>
                    }
                />
            )}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingTop: 15,
            paddingBottom: 10,
        },
        cardExpanded: {
            maxHeight: MAX_CARD_HEIGHT,
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
        list: {
            flexGrow: 0,
        },
        listContent: {
            paddingRight: 6,
            paddingBottom: 6,
            paddingTop: 10,
        },
        emptyText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 13,
            color: theme.colors.textMuted,
            paddingTop: 8,
        },
    }),
)
