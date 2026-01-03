import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import AddProductButton from '@/shared/ui/add-plus'
import { useNavigation } from '@react-navigation/native'

export default function OrdersHeader() {
    const navigation = useNavigation<any>()

    return (
        <View style={styles.row}>
            <Title text="Заказы" />
            <AddProductButton onPress={() => navigation.navigate('OrderCreate')} />
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
