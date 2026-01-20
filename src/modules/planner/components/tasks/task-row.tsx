import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { PlannerListItem } from '@/shared/types/types'
import { formatTaskMeta } from '../../utils/planner-date'
import { useTheme } from '@/shared/theme/useTheme'

type Props = {
    item: PlannerListItem & { completed: boolean }
    isPast: boolean
    onToggle: () => void
    onPress: () => void
}

export default function TaskRow({ item, isPast, onToggle, onPress }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const chip =
        item.kind === 'order'
            ? item.deliveryType === 'pickup'
                ? 'Выдача'
                : 'Доставка'
            : null

    const checkStyle = [
        styles.check,
        isPast && styles.checkPast,
        item.completed && styles.checkCompleted,
        isPast && item.completed && styles.checkCompletedPast,
    ]

    return (
        <View style={styles.row}>
            <Pressable onPress={onToggle} style={checkStyle}>
                {item.completed && (
                    <Ionicons name="checkmark" size={14} color={colors.fixedWhite} />
                )}
            </Pressable>

            <Pressable onPress={onPress} style={styles.content}>
                <Text
                    style={[styles.title, isPast && styles.titlePast]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                >
                    {item.title}
                </Text>

                <View style={styles.metaRow}>
                    <Text
                        style={[styles.meta, isPast && styles.metaPast]}
                        numberOfLines={1}
                    >
                        {formatTaskMeta(item.date, item.time)}
                    </Text>

                    {!!chip && (
                        <View style={[styles.chip, isPast && styles.chipPast]}>
                            <Text style={styles.chipText}>{chip}</Text>
                        </View>
                    )}
                </View>
            </Pressable>
        </View>
    )
}

const ROW_HEIGHT = 86
export { ROW_HEIGHT }

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            minHeight: ROW_HEIGHT,
            paddingVertical: 10,
        },
        check: {
            width: 18,
            height: 18,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: theme.colors.brand,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
            marginRight: 12,
        },
        checkPast: {
            borderColor: theme.colors.textMuted,
        },
        checkCompleted: {
            backgroundColor: theme.colors.brand,
        },
        checkCompletedPast: {
            backgroundColor: theme.colors.textMuted,
        },
        content: {
            flex: 1,
        },
        title: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            lineHeight: 16,
            color: theme.colors.text,
        },
        titlePast: {
            color: theme.colors.textMuted,
        },
        metaRow: {
            marginTop: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
        },
        meta: {
            flex: 1,
            fontFamily: 'Epilogue-Regular',
            fontSize: 13,
            color: theme.colors.textMuted,
        },
        metaPast: {
            color: theme.colors.textMuted,
        },
        chip: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.warning,
        },
        chipPast: {
            backgroundColor: theme.colors.textMuted,
        },
        chipText: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 10,
            color: theme.colors.fixedWhite,
        },
    }),
)
