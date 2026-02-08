import { ModeSwitch } from '@/shared/components/mode-switch/mode-switch'
import Title from '@/shared/ui/title'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

type Mode = 'planner' | 'tasks'

type Props = {
    tasksActive: boolean
    onTasksPress: () => void
    onPlannerPress: () => void
}

export default function ProductsHeader({
    tasksActive,
    onTasksPress,
    onPlannerPress,
}: Props) {
    const value: Mode = tasksActive ? 'tasks' : 'planner'

    const switchItems = useMemo(
        () => [
            { key: 'planner' as Mode, label: 'планер' },
            { key: 'tasks' as Mode, label: 'задачи' },
        ],
        [],
    )

    return (
        <View style={styles.row}>
            <Title text="Планер" />

            <ModeSwitch<Mode>
                items={switchItems}
                value={value}
                onChange={(next: string) => {
                    if (next === 'tasks') onTasksPress()
                    else onPlannerPress()
                }}
                height={40}
                radius={15}
                inset={3}
                itemGap={0}
                contentPaddingX={12}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 7,
        marginBottom: 10,
    },
})
