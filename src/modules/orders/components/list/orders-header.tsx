import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import AddPlus from '@/shared/ui/add-plus'
import { AppStackParamList } from '@/core/navigation/app-navigation'
import { ProductsStackParamList } from '@/core/navigation/products-stack'
import { StackNavigationProp } from '@react-navigation/stack'

type Nav = CompositeNavigationProp<
    StackNavigationProp<ProductsStackParamList, 'ProductsList'>,
    StackNavigationProp<AppStackParamList, 'Tabs'>
>

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
