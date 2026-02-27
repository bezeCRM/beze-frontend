import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Nav, Route } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { getOrderPaymentStatus } from '../utils/orderPaymentStatus'
import { useOrdersStore } from '../store/orders.store'
import { toApiError } from '@/api/http/errors'
import { cutOrderId } from '@/shared/utils/utils'

export default function OrderInfoScreen() {
    const styles = useStyles()
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<Route<'OrderInfo'>>()
    const { show } = useToast()

    const orderId = route.params.orderId
    const { order, setInPlanner } = useOrderInfo(orderId)

    const [deleteVisible, setDeleteVisible] = useState(false)

    const createdLabel = useMemo(
        () => formatCreatedAt(order?.createdAt),
        [order?.createdAt],
    )

    const removeOrder = useOrdersStore(s => s.removeOrder)
    const patchOrder = useOrdersStore(s => s.patchOrder)

    if (!order) return null

    const openDelete = () => setDeleteVisible(true)
    const closeDelete = () => setDeleteVisible(false)

    const confirmDelete = async () => {
        try {
            await removeOrder(orderId) // orderId должен быть из route/props
            closeDelete()
            navigation.goBack()
            requestAnimationFrame(() => {
                show('Заказ удалён', 'success', { scope: TOAST_SCOPES.Orders })
            })
        } catch (e) {
            closeDelete()
            show(toApiError(e).message, 'error', { scope: TOAST_SCOPES.OrderInfo })
        }
    }

    const deleteMessage = `Вы уверены, что хотите удалить заказ ${order.name ? `"${order.name}"` : `#${order.id}`}?`

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction
                        onActionPress={() =>
                            navigation.navigate('OrderEdit', { orderId: order.id })
                        }
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                >
                    <InternalHeaderTitle
                        title={order.name ? order.name : `Заказ #${cutOrderId(order.id)}`}
                    />

                    {!!createdLabel && <Text style={styles.created}>{createdLabel}</Text>}

                    <OrderStatusBar
                        status={order.status}
                        paymentStatus={getOrderPaymentStatus(order)}
                        totalPrice={order.totalPrice}
                        paidAmount={order.paidAmount}
                        onChangeStatus={async s => {
                            await patchOrder(order.id, { status: s })
                        }}
                        onChangePaidAmount={async v => {
                            await patchOrder(order.id, { paidAmount: v })
                        }}
                        onError={msg =>
                            show(msg, 'error', { scope: TOAST_SCOPES.OrderInfo })
                        }
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

                <ToastViewport scope={TOAST_SCOPES.OrderInfo} bottomOffset={15} />
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1 },
        stickyTopBar: {},
        created: {
            marginTop: -15,
            fontSize: 13,
            color: theme.colors.textMuted,
            fontFamily: 'Epilogue-Regular',
            marginLeft: 2,
        },
        content: { rowGap: 15, marginTop: 15 },
    }),
)
