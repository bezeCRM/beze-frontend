import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
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
import Button from '@/shared/ui/button/button'
import SelectField from '@/shared/ui/fields/select-field'
import TextareaField from '@/shared/ui/fields/textarea-field'

import OrderDecorPricesSection from '../components/create&edit/order-decor-prices-section'
import OrderDeliverySection from '../components/create&edit/order-delivery-section'
import OrderExtraSection from '../components/create&edit/order-extra-section'
import OrderProductsSection from '../components/create&edit/order-products-section'
import OrderReferencesPicker from '../components/create&edit/order-references-picker'
import OrderTextField from '../components/create&edit/order-text-field'

import {
    type OrderCreateFormValues,
    type OrderCreateItem,
    type OrderPaymentStatus,
    type OrderStatus,
    useOrderCreateForm,
} from '../hooks/useOrderCreateForm'
import { useOrderCreateInvalidToast } from '../hooks/useOrderCreateInvalidToast'
import { useOrderProductPicker } from '../hooks/useOrderProductPicker'
import { useOrderTotalPrice } from '../hooks/useOrderTotalPrice'

import PartialPaymentRow from '../components/create&edit/partial-payment-row'
import { useOrderPayment } from '../hooks/useOrderPayment'
import { useOrderReferences } from '../hooks/useOrderReferences'
import { buildNewOrderPayload } from '../utils/buildNewOrderPayload'
import { formatMoneyRu } from '../utils/money'
import { ORDER_PAYMENT_OPTIONS, ORDER_STATUS_OPTIONS } from '../utils/order-options'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Nav } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'

const MAX_REFERENCES = 3

export default function OrderCreateScreen() {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const { show } = useToast()

    const addOrder = useOrdersStore(s => s.addOrder)
    const products = useProductsStore(s => s.products)
    const getProductById = useProductsStore(s => s.getById)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setPickup,
        setPaymentStatus,
        setStatus,
        togglePlanner,
        addItem,
        removeItem,
        incCount,
        decCount,
        setWeightKg,
        setDecorPrice,
        addReferences,
        removeReference,
        clearDraft,
        hasDraft,
    } = useOrderCreateForm()

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

    const paymentStatus = watch('paymentStatus') as OrderPaymentStatus
    const paidAmountText = (watch('paidAmount') as string) ?? ''

    const status = watch('status') as OrderStatus
    const inPlanner = !!watch('inPlanner')

    const totalPrice = useOrderTotalPrice(items, extra)

    const { openPickProduct } = useOrderProductPicker({
        products: products ?? [],
        getProductById,
        addItem,
        toastScope: TOAST_SCOPES.OrderCreate,
    })

    const onInvalid = useOrderCreateInvalidToast(show as any, TOAST_SCOPES.OrderCreate)

    const { remaining, onSelectPaymentStatus, onPaidAmountBlur } = useOrderPayment({
        totalPrice,
        paymentStatus,
        paidAmountText,
        setPaymentStatus,
        setValue,
    })

    const { handleAddReferences } = useOrderReferences({
        maxCount: MAX_REFERENCES,
        references,
        addReferences,
    })

    const onValid = useCallback(
        (values: OrderCreateFormValues) => {
            const payload = buildNewOrderPayload(values, totalPrice)
            addOrder(payload)
            clearDraft()

            navigation.goBack()
            requestAnimationFrame(() => {
                show('Заказ добавлен', 'success', { scope: TOAST_SCOPES.Orders })
            })
        },
        [addOrder, clearDraft, navigation, show, totalPrice],
    )

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction={hasDraft}
                        onActionPress={hasDraft ? clearDraft : undefined}
                        actionText={hasDraft ? 'Очистить' : undefined}
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
                        <InternalHeaderTitle title="Новый заказ" />
                    </View>

                    <View style={styles.formList}>
                        <OrderTextField
                            title="Название заказа"
                            value={name}
                            placeholder='Например, "торт на 23 февраля"'
                            onChangeText={t => setValue('name', t)}
                        />

                        <OrderTextField
                            title="Имя клиента"
                            required
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

                        <SelectField
                            label="Статус оплаты"
                            options={ORDER_PAYMENT_OPTIONS as any}
                            selectedId={paymentStatus}
                            onSelect={opt =>
                                onSelectPaymentStatus(opt.id as OrderPaymentStatus)
                            }
                            error={false}
                            addCategoryEnabled={false}
                        />

                        {paymentStatus === 'partial' && (
                            <PartialPaymentRow
                                paidAmountText={paidAmountText}
                                onChangePaidAmountText={t =>
                                    setValue('paidAmount', t, { shouldDirty: true })
                                }
                                onBlur={onPaidAmountBlur}
                                remaining={remaining}
                                hasError={!!(errors as any).paidAmount}
                            />
                        )}

                        <SelectField
                            label="Статус заказа"
                            options={ORDER_STATUS_OPTIONS as any}
                            selectedId={status}
                            onSelect={opt => setStatus(opt.id as OrderStatus)}
                            error={false}
                            addCategoryEnabled={false}
                        />

                        <View style={styles.plannerRowFinal}>
                            <Text style={styles.plannerLabel}>Добавить в планер</Text>
                            <View style={{ transform: [{ scale: 0.95 }] }}>
                                <Switch
                                    value={inPlanner}
                                    onValueChange={togglePlanner}
                                    trackColor={{
                                        false: colors.border,
                                        true: colors.brand,
                                    }}
                                    thumbColor={colors.fixedWhite}
                                    ios_backgroundColor={colors.border}
                                />
                            </View>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Итоговая стоимость:</Text>
                            <Text style={styles.totalValue}>
                                {formatMoneyRu(totalPrice)} ₽
                            </Text>
                        </View>

                        <Button
                            title="Создать заказ"
                            onPress={handleSubmit(onValid, onInvalid)}
                        />
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={TOAST_SCOPES.OrderCreate} bottomOffset={75} />
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

        plannerRowFinal: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 15,
            paddingLeft: 18,
            backgroundColor: theme.colors.surface,
            paddingVertical: 11,
            borderRadius: 25,
            marginBottom: 5,
        },
        plannerLabel: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },

        totalRow: {
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            paddingHorizontal: 3,
            marginBottom: 7,
        },
        totalLabel: {
            fontSize: 16,
            textAlign: 'center',
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        totalValue: {
            fontSize: 24,
            textAlign: 'center',
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
    }),
)
