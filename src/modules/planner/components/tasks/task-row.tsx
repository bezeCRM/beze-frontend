import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { PlannerListItem } from '@/shared/types/types'
import { formatTaskMeta } from '../../utils/planner-date'
import { Icon } from '@/shared/ui/icon/icon'

type Props = {
    item: PlannerListItem & { completed: boolean }
    isPast: boolean
    onToggle: () => void
    onPress: () => void
    onLongPress?: () => void
}

const ROW_HEIGHT = 66
export { ROW_HEIGHT }

export default function TaskRow({ item, isPast, onToggle, onPress, onLongPress }: Props) {
    const styles = useStyles()

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
            <Pressable onPress={onToggle} style={checkStyle} hitSlop={15}>
                {item.completed && <Icon name={'checkmark-icon'} size={13} />}
            </Pressable>

            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={250}
                style={styles.content}
            >
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
                            <Text style={styles.chipText} allowFontScaling={false}>
                                {chip}
                            </Text>
                        </View>
                    )}
                </View>
            </Pressable>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            maxHeight: ROW_HEIGHT,
        },
        check: {
            width: 22,
            height: 22,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: theme.colors.brand,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
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
            paddingTop: 3,
        },
        title: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            lineHeight: 15,
            color: theme.colors.text,
        },
        titlePast: {
            color: theme.colors.textMuted,
        },
        metaRow: {
            marginTop: 7,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        meta: {
            flexShrink: 1,
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 14,
            lineHeight: 14,
            color: theme.colors.text,
        },
        metaPast: {
            color: theme.colors.textMuted,
        },
        chip: {
            flexShrink: 0,
            paddingHorizontal: 8,
            paddingTop: 5,
            paddingBottom: 3,
            borderRadius: 999,
            marginTop: -2,
            backgroundColor: theme.colors.warning,
        },
        chipPast: {
            backgroundColor: theme.colors.textMuted,
        },
        chipText: {
            fontFamily: 'Epilogue-Semibold',
            fontSize: 12,
            lineHeight: 12,
            color: theme.colors.fixedWhite,
        },
    }),
)
