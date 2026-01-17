import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { OrdersStackParamList } from '@/core/navigation/orders-stack'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { useOrdersStore } from '../store/orders.store'
import { useProductsStore } from '@/modules/products/store/products.store'
import type { PhotoItem } from '@/shared/types/types'
import TextareaField from '@/shared/ui/fields/textarea-field'

import OrderDecorPricesSection from '../components/create&edit/order-decor-prices-section'
import OrderDeliverySection from '../components/create&edit/order-delivery-section'
import OrderExtraSection from '../components/create&edit/order-extra-section'
import OrderProductsSection from '../components/create&edit/order-products-section'
import OrderReferencesPicker from '../components/create&edit/order-references-picker'
import OrderTextField from '../components/create&edit/order-text-field'

import type { OrderCreateFormValues, OrderCreateItem } from '../hooks/useOrderCreateForm'
import { useOrderCreateInvalidToast } from '../hooks/useOrderCreateInvalidToast'
import { useOrderEditForm } from '../hooks/useOrderEditForm'
import { useOrderProductPicker } from '../hooks/useOrderProductPicker'
import { useOrderReferences } from '../hooks/useOrderReferences'
import { useOrderTotalPrice } from '../hooks/useOrderTotalPrice'
import { buildNewOrderPayload } from '../utils/buildNewOrderPayload'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

const MAX_REFERENCES = 3
const ORDER_INFO_TOAST_SCOPE = 'orderInfo'

type R = RouteProp<OrdersStackParamList, 'OrderEdit'>
type Nav = StackNavigationProp<OrdersStackParamList, 'OrderEdit'>

export default function OrderEditScreen() {
    const styles = useStyles()
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<R>()
    const { show } = useToast()

    const orderId = route.params.orderId
    const order = useOrdersStore(s => s.getById(orderId))
    const updateOrder = useOrdersStore(s => s.updateOrder)

    const products = useProductsStore(s => s.products)
    const getProductById = useProductsStore(s => s.getById)

    const form = useOrderEditForm(order)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setPickup,
        addItem,
        removeItem,
        incCount,
        decCount,
        setWeightKg,
        setDecorPrice,
        addReferences,
        removeReference,
    } = form

    const name = watch('name') ?? ''
    const clientName = watch('clientName') ?? ''
    const clientPhone = watch('clientPhone') ?? ''
    const orderPlatform = watch('orderPlatform') ?? ''

    const delivery = watch('delivery')
    const watchedItems = watch('items')
    const items = useMemo(() => (watchedItems as OrderCreateItem[]) ?? [], [watchedItems])
    const extra = watch('extra')
    const notes = watch('notes') ?? ''
    const references = (watch('references') as PhotoItem[]) ?? []

    const totalPrice = useOrderTotalPrice(items, extra)

    const { openPickProduct } = useOrderProductPicker({
        products: products ?? [],
        getProductById,
        addItem,
    })

    const onInvalid = useOrderCreateInvalidToast(show as any, route.key)

    const { handleAddReferences } = useOrderReferences({
        maxCount: MAX_REFERENCES,
        references,
        addReferences,
    })

    const onValid = useCallback(
        (values: OrderCreateFormValues) => {
            if (!order) return
            const payload = buildNewOrderPayload(values, totalPrice)
            updateOrder(order.id, payload as any)
            const unsub = navigation.addListener('transitionEnd', () => {
                unsub()
                show('Изменения сохранены', 'success', { scope: ORDER_INFO_TOAST_SCOPE })
            })
            navigation.goBack()
        },
        [navigation, order, show, totalPrice, updateOrder],
    )

    if (!order) {
        return (
            <ScreenContainer>
                <View style={styles.container}>
                    <View style={styles.stickyTopBar}>
                        <InternalHeaderTopBar onBack={() => navigation.goBack()} />
                    </View>
                    <View style={styles.emptyBody}>
                        <Text style={styles.emptyText}>Заказ не найден</Text>
                    </View>
                </View>
            </ScreenContainer>
        )
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction={true}
                        onActionPress={handleSubmit(onValid, onInvalid)}
                        actionText="Сохранить"
                    />
                </View>

                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    enableAutomaticScroll
                    extraScrollHeight={80}
                    extraHeight={80}
                    enableResetScrollToCoords={false}
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.titleWrap}>
                        <InternalHeaderTitle title="Изменение заказа" />
                    </View>

                    <View style={styles.formList}>
                        <OrderTextField
                            title="Название заказа"
                            value={name}
                            placeholder='Например, "торт на 23 февраля"'
                            onChangeText={t => setValue('name', t)}
                        />

                        <OrderTextField
                            title="Имя клиента *"
                            value={clientName}
                            onChangeText={t =>
                                setValue('clientName', t, { shouldValidate: true })
                            }
                            placeholder="Введите имя"
                            error={!!errors.clientName}
                        />

                        <OrderTextField
                            title="Номер телефона клиента"
                            value={clientPhone}
                            placeholder="Введите номер"
                            onChangeText={t =>
                                setValue('clientPhone', t, { shouldValidate: true })
                            }
                            keyboardType="phone-pad"
                            error={!!errors.clientPhone}
                            errorText={
                                errors.clientPhone ? '*Некорректный номер' : undefined
                            }
                        />

                        <OrderTextField
                            title="Платформа заказа"
                            value={orderPlatform}
                            placeholder="Avito, Flowwow или другая"
                            onChangeText={t => setValue('orderPlatform', t)}
                        />

                        <OrderDeliverySection
                            isPickup={!!delivery?.isPickup}
                            address={delivery?.address ?? ''}
                            date={delivery?.date ?? ''}
                            time={delivery?.time ?? ''}
                            onTogglePickup={setPickup}
                            onChangeAddress={t =>
                                setValue('delivery.address', t, { shouldValidate: true })
                            }
                            onChangeDate={t =>
                                setValue('delivery.date', t, { shouldValidate: true })
                            }
                            onChangeTime={t =>
                                setValue('delivery.time', t, { shouldValidate: true })
                            }
                            addressError={!!(errors as any)?.delivery?.address}
                            dateError={!!(errors as any)?.delivery?.date}
                            timeError={!!(errors as any)?.delivery?.time}
                        />

                        <OrderProductsSection
                            items={items as any}
                            onAddPress={openPickProduct}
                            onInc={incCount}
                            onDec={decCount}
                            onChangeWeight={setWeightKg}
                            onRemove={removeItem}
                        />

                        <OrderDecorPricesSection
                            items={items as any}
                            onChange={setDecorPrice}
                            onAddPress={openPickProduct}
                        />

                        <OrderExtraSection
                            delivery={extra?.delivery ?? '0'}
                            urgency={extra?.urgency ?? '0'}
                            other={extra?.other ?? '0'}
                            discount={extra?.discount ?? '0'}
                            onChangeDelivery={t =>
                                setValue('extra.delivery', t, { shouldDirty: true })
                            }
                            onChangeUrgency={t =>
                                setValue('extra.urgency', t, { shouldDirty: true })
                            }
                            onChangeOther={t =>
                                setValue('extra.other', t, { shouldDirty: true })
                            }
                            onChangeDiscount={t =>
                                setValue('extra.discount', t, { shouldDirty: true })
                            }
                        />

                        <TextareaField
                            label="Примечания"
                            placeholder='Например, "сделать как можно скорее"'
                            multiline
                            value={notes}
                            onChangeText={t => setValue('notes', t)}
                        />

                        <OrderReferencesPicker
                            items={references}
                            maxCount={MAX_REFERENCES}
                            onAddPress={() => {
                                void handleAddReferences()
                            }}
                            onDeletePress={removeReference}
                        />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Итоговая стоимость:</Text>
                            <Text style={styles.totalValue}>
                                {totalPrice.toLocaleString('ru-RU')} ₽
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={route.key} bottomOffset={75} />
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        stickyTopBar: { backgroundColor: theme.colors.background },
        scroll: { flex: 1 },
        titleWrap: {},
        formList: { rowGap: 15 },

        totalRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 3,
            marginBottom: 7,
        },
        totalLabel: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        totalValue: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },

        emptyBody: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textMuted,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
