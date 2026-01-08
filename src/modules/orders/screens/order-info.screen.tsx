import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { OrdersStackParamList } from '@/core/navigation/orders-stack'
import ScreenContainer from '@/shared/components/layout/screen-container'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import Button from '@/shared/ui/button/button'

import BaseModal from '@/modules/modal/base/base-modal'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'

import { formatCreatedAt } from '../utils/order-format'
import { useOrderInfo } from '../hooks/useOrderInfo'
import OrderStatusBar from '../components/info/order-status-bar'
import OrderClientInfo from '../components/info/order-client-info'
import OrderDeliveryInfo from '../components/info/order-delivery-info'
import OrderProductsInfo from '../components/info/order-products-info'
import OrderNotesInfo from '../components/info/order-notes-info'
import OrderReferencesInfo from '../components/info/order-references-info'
import OrderPlannerToggle from '../components/info/order-planner-toggle'
import OrderTotalRow from '../components/info/order-total-row'
import { theme } from '@/shared/theme'

type R = RouteProp<OrdersStackParamList, 'OrderInfo'>
type Nav = StackNavigationProp<OrdersStackParamList, 'OrderInfo'>

export default function OrderInfoScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<R>()
    const { show } = useToast()

    const orderId = route.params.orderId
    const {
        order,
        setStatus,
        setPaymentStatus,
        setPaidAmount,
        setInPlanner,
        removeOrder,
    } = useOrderInfo(orderId)

    const [deleteVisible, setDeleteVisible] = useState(false)

    const createdLabel = useMemo(
        () => formatCreatedAt(order?.createdAt),
        [order?.createdAt],
    )

    if (!order) return null

    const openDelete = () => setDeleteVisible(true)
    const closeDelete = () => setDeleteVisible(false)

    const confirmDelete = () => {
        const deletedId = order.id
        const deletedName = `${order.name ? `"${order.name}"` : `#${order.id}`}`

        setDeleteVisible(false)

        requestAnimationFrame(() => {
            const unsub = navigation.addListener('transitionEnd', () => {
                unsub()
                removeOrder(deletedId)
                show(`Заказ ${deletedName} удален`, 'success', { scope: 'ordersList' })
            })

            navigation.goBack()
        })
    }

    const deleteMessage = `Вы уверены, что хотите удалить заказ ${order.name ? `"${order.name}"` : `#${order.id}`}?`

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showEdit
                        onEditPress={() =>
                            navigation.navigate('OrderEdit', { orderId: order.id })
                        }
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                >
                    <InternalHeaderTitle
                        title={order.name ? order.name : `Заказ #${order.id}`}
                    />

                    {!!createdLabel && <Text style={styles.created}>{createdLabel}</Text>}

                    <OrderStatusBar
                        status={order.status}
                        paymentStatus={order.paymentStatus}
                        totalPrice={order.totalPrice}
                        paidAmount={order.paidAmount}
                        onChangeStatus={setStatus}
                        onChangePayment={setPaymentStatus}
                        onChangePaidAmount={setPaidAmount}
                    />

                    <View style={styles.content}>
                        <OrderClientInfo order={order} />
                        <OrderDeliveryInfo order={order} />
                        <OrderProductsInfo order={order} />
                        <OrderNotesInfo order={order} />
                        <OrderReferencesInfo order={order} />

                        <OrderPlannerToggle
                            value={!!order.inPlanner}
                            onChange={setInPlanner}
                        />

                        <OrderTotalRow totalPrice={order.totalPrice} />

                        <Button title="Удалить заказ" onPress={openDelete} red />
                    </View>
                </ScrollView>

                <BaseModal visible={deleteVisible} onClose={closeDelete}>
                    <ConfirmModal
                        title="Удаление заказа"
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
    created: {
        marginTop: -15,
        fontSize: 13,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
        marginLeft: 2,
    },
    content: { rowGap: 15, marginTop: 15 },
})
