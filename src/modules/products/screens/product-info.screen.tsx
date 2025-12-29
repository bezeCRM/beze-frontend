import { View, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

import ScreenContainer from '@/shared/components/screen-container'
import {
    InternalHeaderTopBar,
    InternalHeaderTitle,
} from '@/shared/components/internal-header'
import { ToastViewport } from '@/shared/components/toast/toast-provider'
import { useProductsStore } from '@/shared/store/products'
import type { ProductsStackParamList } from '@/core/navigation/products-stack'
import type { RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'

import {
    FillingsChips,
    ProductInfoBlock,
    ProductPrice,
    ProductPhotoes,
} from '../components/info'
import Button from '@/shared/ui/button/button'

import BaseModal from '@/modules/modal/base/base-modal'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'

type Route = RouteProp<ProductsStackParamList, 'ProductInfo'>
type Navigation = StackNavigationProp<ProductsStackParamList, 'ProductInfo'>

export default function ProductInfoScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Navigation>()
    const route = useRoute<Route>()

    const productId = route.params.productId
    const product = useProductsStore(s => s.getById(productId))
    const removeProduct = useProductsStore(s => s.removeProduct)

    const [deleteVisible, setDeleteVisible] = useState(false)

    useEffect(() => {
        if (!product) return
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, !!product])

    if (!product) return null

    const openDelete = () => setDeleteVisible(true)
    const closeDelete = () => setDeleteVisible(false)

    const confirmDelete = () => {
        closeDelete()
        removeProduct(product.id)
        navigation.goBack()
    }

    const deleteMessage = `Вы уверены, что хотите удалить товар "${product.name}"?`

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showEdit
                        onEditPress={() =>
                            navigation.navigate('ProductEdit', { productId: product.id })
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

                        <Button title="Удалить товар" onPress={openDelete} red />
                    </View>
                </ScrollView>

                <BaseModal visible={deleteVisible} onClose={closeDelete}>
                    <ConfirmModal
                        title="Удаление товара"
                        message={deleteMessage}
                        onConfirm={confirmDelete}
                        onCancel={closeDelete}
                        onClose={closeDelete}
                        confirmText="Удалить"
                        cancelText="Отмена"
                    />
                </BaseModal>

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
