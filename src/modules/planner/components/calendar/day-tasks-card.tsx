import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { formatTaskMeta } from '../../utils/planner-date'
import { PlannerListItem } from '@/shared/types/types'

type Props = {
    tasks: PlannerListItem[]
    onPress: () => void
}

function deliveryLabel(deliveryType: any) {
    if (!deliveryType) return null
    const v = String(deliveryType).toLowerCase()

    if (v.includes('delivery') || v.includes('достав')) return 'доставка'
    if (v.includes('pickup') || v.includes('self') || v.includes('выда')) return 'выдача'

    return null
}

export default function DayTasksCard({ tasks, onPress }: Props) {
    const styles = useStyles()

    if (!tasks.length) {
        return (
            <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Нет задач</Text>
            </View>
        )
    }

    return (
        <View style={styles.card}>
            {[...tasks]
                .sort((a, b) => {
                    const aKey = `${a.date} ${a.time ?? '00:00'}`
                    const bKey = `${b.date} ${b.time ?? '00:00'}`
                    return aKey.localeCompare(bKey)
                })
                .map(task => {
                    const isOrder = (task as any).kind === 'order'
                    const label = isOrder
                        ? deliveryLabel((task as any).deliveryType)
                        : null
                    const titleStyle = label ? styles.titleTextMarked : styles.titleText

                    return (
                        <Pressable key={task.id} style={styles.row} onPress={onPress}>
                            <Text style={styles.metaTime} numberOfLines={1}>
                                {formatTaskMeta(task.date, task.time).split(', ')[2]}
                            </Text>

                            <Text style={titleStyle} numberOfLines={1}>
                                {task.title}
                            </Text>
                        </Pressable>
                    )
                })}
        </View>
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
            paddingVertical: 8,
        },
        metaTime: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 16,
            color: theme.colors.text,
        },
        titleText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.text,
            marginTop: -3,
        },
        titleTextMarked: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.warning,
            marginTop: -3,
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
