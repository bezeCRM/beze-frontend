import { View, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'

import ScreenContainer from '@/shared/components/screen-container'
import {
    InternalHeaderTopBar,
    InternalHeaderTitle,
} from '@/shared/components/internal-header'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { useProductsStore } from '@/shared/store/products'
import type { ProductsStackParamList } from '@/core/navigation/products-stack'
import type { RouteProp } from '@react-navigation/native'

import {
    FillingsChips,
    ProductInfoBlock,
    ProductPrice,
    ProductPhotoes,
} from '../components/info'
import Button from '@/shared/ui/button/button'

type Route = RouteProp<ProductsStackParamList, 'ProductInfo'>

export default function ProductInfoScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation()
    const route = useRoute<Route>()
    const { show } = useToast()

    const product = useProductsStore(s => s.getById(route.params.productId))

    if (!product) {
        navigation.goBack()
        return null
    }
    console.log('PHOTOES:', product?.photoes)

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showEdit
                        onEditPress={() =>
                            show('Редактирование скоро будет доступно', 'info', {
                                scope: route.key,
                            })
                        }
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                >
                    <InternalHeaderTitle title={product.name} />

                    <View style={styles.content}>
                        <FillingsChips fillings={product.fillings ?? []} />
                        <ProductInfoBlock product={product} />
                        <ProductPrice price={product.price} unit={product.unit} />
                        <ProductPhotoes photoes={product.photoes} />

                        <Button
                            title="Удалить товар"
                            onPress={() => console.log('*удалено*')}
                            red
                        />
                    </View>
                </ScrollView>

                <ToastViewport scope={route.key} bottomOffset={75} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    stickyTopBar: {},
    content: { rowGap: 15, marginTop: -5 },
})
