import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import TasksBtn from './tasks-btn'

type Props = {
    TasksActive: boolean
    onTasksPress: () => void
}

export default function ProductsHeader({ TasksActive, onTasksPress }: Props) {
    return (
        <View style={styles.row}>
            <Title text="Планер" />
            <TasksBtn active={TasksActive} onPress={onTasksPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 7,
        marginBottom: 10,
    },
})
