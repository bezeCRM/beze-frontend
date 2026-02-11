import { FlatList, View, Text, StyleSheet } from 'react-native'
import ProductCard from './product-card'
import type { Product } from '@/shared/types/types'
import { useNavigation } from '@react-navigation/native'
import Button from '@/shared/ui/button/button'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Nav } from '@/core/navigation/types'

type Props = { items: Product[] }

export default function ProductsList({ items }: Props) {
    const styles = useStyles()
    const navigation = useNavigation<Nav>()

    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Товаров в этой категории пока нет</Text>
            <Button
                title="Добавить товар"
                onPress={() => navigation.navigate('ProductCreate')}
            />
        </View>
    )

    return (
        <FlatList
            style={styles.list}
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
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
                items.length ? undefined : styles.emptyContent,
                { paddingBottom: 105 },
            ]}
            showsVerticalScrollIndicator={false}
        />
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        list: { flex: 1 },
        emptyContent: {
            paddingTop: 30,
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 30,
        },
        emptyWrap: {
            rowGap: 20,
            alignItems: 'center',
        },
        emptyTitle: {
            fontSize: 16,
            color: theme.colors.textMuted,
        },
    }),
)
