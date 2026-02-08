import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ProductsStackParamList } from '@/core/navigation/products-stack'
import { AppStackParamList } from '@/core/navigation/app-navigation'
import AddPlus from '@/shared/ui/add-plus'

type Nav = CompositeNavigationProp<
    StackNavigationProp<ProductsStackParamList, 'ProductsList'>,
    StackNavigationProp<AppStackParamList, 'Tabs'>
>

export default function ProductsHeader() {
    const navigation = useNavigation<Nav>()

    return (
        <View style={styles.row}>
            <Title text="Товары" />
            <AddPlus onPress={() => navigation.navigate('ProductCreate')} />
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
