import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'

export default function ProfileHeader() {
    return (
        <View style={styles.row}>
            <Title text="Профиль" />
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
