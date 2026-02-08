import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { formatTaskMeta } from '../../utils/planner-date'
import { formatTasksWord } from '../../utils/planner-tasks'

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
                <View style={styles.metaBox}>
                    <Text style={styles.metaWeekDay} numberOfLines={2}>
                        {formatTaskMeta(nextTask.date, nextTask.time).split(', ')[0] +
                            ','}
                    </Text>
                    <Text style={styles.metaDate} numberOfLines={1}>
                        {formatTaskMeta(nextTask.date, nextTask.time).split(', ')[1]}
                    </Text>
                </View>

                <View style={styles.titleBox}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {nextTask.title}
                    </Text>
                    {more > 0 && (
                        <Text
                            style={styles.more}
                        >{`+${more} ${formatTasksWord(more)}`}</Text>
                    )}
                </View>
            </View>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 14,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
        },
        metaBox: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            rowGap: 3,
        },
        metaWeekDay: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 16,
            color: theme.colors.text,
        },
        metaDate: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.textMuted,
        },
        titleBox: {
            fontFamily: 'Epilogue-Regular',
            justifyContent: 'center',
            alignItems: 'flex-start',
            rowGap: 3,
        },
        titleText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.text,
        },
        more: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 16,
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
