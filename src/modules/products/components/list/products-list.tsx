import { FlatList } from 'react-native'
import ProductCard from './product-card'
import type { Product } from '@/shared/types/types'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProductsStackParamList } from '@/core/navigation/products-stack'

type Props = { items: Product[] }
type Nav = StackNavigationProp<ProductsStackParamList>

export default function ProductsList({ items }: Props) {
    const navigation = useNavigation<Nav>()

    return (
        <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ProductCard
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    fillings={item.fillings}
                    photoes={item.photoes}
                    onPress={() =>
                        navigation.navigate('ProductInfo', {
                            productId: item.id,
                        })
                    }
                />
            )}
            showsVerticalScrollIndicator={false}
        />
    )
}
