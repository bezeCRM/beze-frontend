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
import { useProductsStore } from '@/shared/store/products.store'
import type { RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'

import Button from '@/shared/ui/button/button'
import {
    FillingsChips,
    ProductInfoBlock,
    ProductPhotoes,
    ProductPrice,
} from '../components/info'

import BaseModal from '@/modules/modal/base/base-modal'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'
import { AppStackParamList } from '@/core/navigation/app-navigation'

type Route = RouteProp<AppStackParamList, 'ProductInfo'>
type Navigation = StackNavigationProp<AppStackParamList, 'ProductInfo'>

export default function ProductInfoScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Navigation>()
    const route = useRoute<Route>()

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

        requestAnimationFrame(() => {
            const unsub = navigation.addListener('transitionEnd', () => {
                unsub()
                removeProduct(deletedId)
                show(`Товар "${deletedName}" удален`, 'success', {
                    scope: 'productsList',
                })
            })

            navigation.goBack()
        })
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

                <ToastViewport scope={route.key} bottomOffset={75} horizontalInset={15} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    stickyTopBar: {},
    content: { rowGap: 15, marginTop: -5 },
})
