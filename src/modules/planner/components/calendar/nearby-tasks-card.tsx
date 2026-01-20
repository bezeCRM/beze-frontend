import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { formatTaskMeta } from '../../utils/planner-date'

type Props = {
    nextTask: any | null
    upcomingCount: number
    onPress: () => void
}

export default function NearbyTasksCard({ nextTask, upcomingCount, onPress }: Props) {
    const styles = useStyles()

    if (!nextTask) {
        return (
            <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Пока нет задач</Text>
            </View>
        )
    }

    const more = Math.max(0, upcomingCount - 1)

    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.meta} numberOfLines={1}>
                    {formatTaskMeta(nextTask.date, nextTask.time)
                        .split(', ')
                        .slice(0, 2)
                        .join(', ')}
                </Text>

                <Text style={styles.title} numberOfLines={1}>
                    {nextTask.title}
                </Text>
            </View>

            {more > 0 && <Text style={styles.more}>{`+${more} задачи`}</Text>}
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 14,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        meta: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 13,
            color: theme.colors.textMuted,
        },
        title: {
            flex: 1,
            fontFamily: 'Epilogue-Regular',
            fontSize: 13,
            color: theme.colors.text,
        },
        more: {
            marginTop: 6,
            fontFamily: 'Epilogue-Regular',
            fontSize: 13,
            color: theme.colors.info,
        },
        emptyCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            paddingVertical: 20,
            alignItems: 'center',
        },
        emptyText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
        },
    }),
)
