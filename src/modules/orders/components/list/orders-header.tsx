import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import { useNavigation } from '@react-navigation/native'
import AddPlus from '@/shared/ui/add-plus'
import { Nav } from '@/core/navigation/types'

export default function OrdersHeader() {
    const navigation = useNavigation<Nav>()

    return (
        <View style={styles.row}>
            <Title text="Заказы" />
            <AddPlus onPress={() => navigation.navigate('OrderCreate')} />
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
