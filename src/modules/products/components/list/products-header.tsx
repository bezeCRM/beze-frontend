import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import AddProductButton from '@/shared/ui/add-plus'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ProductsStackParamList } from '@/core/navigation/products-stack'

type Nav = StackNavigationProp<ProductsStackParamList, 'ProductsList'>

export default function ProductsHeader() {
    const navigation = useNavigation<Nav>()

    return (
        <View style={styles.row}>
            <Title text="Товары" />
            <AddProductButton onPress={() => navigation.navigate('ProductCreate')} />
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
