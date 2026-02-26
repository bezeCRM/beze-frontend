import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
import { Nav, Route } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { toApiError } from '@/api/http/errors'
import { sanitizeRubInt } from '@/shared/utils/utils'

const MAX_REFERENCES = 3

export default function OrderEditScreen() {
    const styles = useStyles()
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<Route<'OrderInfo'>>()
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
        toastScope: route.key,
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onInvalid = useOrderCreateInvalidToast(show as any, route.key)

    const { handleAddReferences } = useOrderReferences({
        maxCount: MAX_REFERENCES,
        references,
        addReferences,
    })

    const onValid = useCallback(
        async (values: OrderCreateFormValues) => {
            if (!order) return
            if (isSubmitting) return
            setIsSubmitting(true)
            try {
                const payload = buildNewOrderPayload(values, totalPrice)
                await updateOrder(order.id, payload)

                navigation.goBack()
                requestAnimationFrame(() => {
                    show('Изменения сохранены', 'success', {
                        scope: TOAST_SCOPES.OrderInfo,
                    })
                })
            } catch (e) {
                show(toApiError(e).message, 'error', { scope: TOAST_SCOPES.OrderInfo })
            } finally {
                setIsSubmitting(false)
            }
        },
        [isSubmitting, navigation, order, show, totalPrice, updateOrder],
    )

    if (!order) {
        return (
            <ScreenContainer>
                <View style={styles.container}>
                    <View style={styles.stickyTopBar}>
                        <InternalHeaderTopBar
                            onBack={() => navigation.goBack()}
                            showAction={true}
                            onActionPress={
                                isSubmitting
                                    ? undefined
                                    : handleSubmit(onValid, onInvalid)
                            }
                            actionText={isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        />
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
                        onActionPress={
                            isSubmitting ? undefined : handleSubmit(onValid, onInvalid)
                        }
                        actionText={isSubmitting ? 'Сохранение...' : 'Сохранить'}
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
                                setValue('delivery.date', t, { shouldValidate: false })
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
                                setValue('extra.delivery', sanitizeRubInt(t), {
                                    shouldDirty: true,
                                })
                            }
                            onChangeUrgency={t =>
                                setValue('extra.urgency', sanitizeRubInt(t), {
                                    shouldDirty: true,
                                })
                            }
                            onChangeOther={t =>
                                setValue('extra.other', sanitizeRubInt(t), {
                                    shouldDirty: true,
                                })
                            }
                            onChangeDiscount={t =>
                                setValue('extra.discount', sanitizeRubInt(t), {
                                    shouldDirty: true,
                                })
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

                <ToastViewport scope={route.key} bottomOffset={15} />
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
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            paddingHorizontal: 3,
            marginBottom: 7,
        },
        totalLabel: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        totalValue: {
            fontSize: 24,
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
