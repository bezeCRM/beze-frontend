import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { useProductsStore } from '../store/products.store'

import Button from '@/shared/ui/button/button'
import {
    FillingsChips,
    ProductInfoBlock,
    ProductPhotoes,
    ProductPrice,
} from '../components/info'

import BaseModal from '@/modules/modal/base/base-modal'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'
import { Nav, Route } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'

export default function ProductInfoScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<Route<'ProductInfo'>>()

    const productId = route.params.productId
    const product = useProductsStore(s => s.getById(productId))
    const removeProduct = useProductsStore(s => s.removeProduct)

    // удаление товара
    const { show } = useToast()
    const [deleteVisible, setDeleteVisible] = useState(false)

    useEffect(() => {
        if (!product) return
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, !!product])

    if (!product) return null

    const openDelete = () => setDeleteVisible(true)
    const closeDelete = () => setDeleteVisible(false)

    const confirmDelete = () => {
        const deletedId = product.id
        const deletedName = product.name

        setDeleteVisible(false)
        navigation.goBack()

        requestAnimationFrame(() => {
            setTimeout(() => {
                removeProduct(deletedId)
                show(`Товар "${deletedName}" удален`, 'success', {
                    scope: TOAST_SCOPES.Products,
                })
            }, 0)
        })
    }

    const deleteMessage = `Вы уверены, что хотите удалить товар "${product.name}"?`

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction
                        onActionPress={() =>
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

                <ToastViewport scope={TOAST_SCOPES.ProductInfo} bottomOffset={25} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    stickyTopBar: {},
    content: { rowGap: 15, marginTop: -5 },
})
