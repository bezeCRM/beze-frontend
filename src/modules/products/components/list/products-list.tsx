import { FlatList } from 'react-native'
import ProductCard from './product-card'
import type { Product } from '@/shared/types/types'

type Props = { items: Product[] }

export default function ProductsList({ items }: Props) {
    return (
        <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ProductCard
                    name={item.name}
                    price={item.price}
                    fillings={item.fillings}
                    id={item.id}
                />
            )}
            showsVerticalScrollIndicator={false}
        />
    )
}
