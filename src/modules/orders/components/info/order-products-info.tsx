import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import type { Order, OrderProductLine } from '@/shared/types/types'
import { formatAmount, formatMoney } from '../../utils/order-format'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppStackParamList } from '@/core/navigation/app-navigation'

type Props = { order: Order }

function Row({ line, onPress }: { line: OrderProductLine; onPress?: () => void }) {
    const name = line.product?.name ?? '—'
    const filling = line.filling?.name?.trim() || ''
    const price = typeof line.price === 'number' ? line.price : (line.product?.price ?? 0)
    const unit = line.unit ?? line.product?.unit
    const amount = typeof line.amount === 'number' ? line.amount : 1
    const photo = line.product?.photoes?.[0].uri ?? undefined

    return (
        <TouchableOpacity
            style={styles.row}
            activeOpacity={0.85}
            onPress={onPress}
            disabled={!onPress}
        >
            <Image
                source={photo ? { uri: photo } : PlaceholderImage}
                style={styles.photo}
            />

            <View style={styles.mid}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>

                {!!filling && (
                    <Text style={styles.filling} numberOfLines={1}>
                        {filling}
                    </Text>
                )}

                <Text style={styles.price} numberOfLines={1}>
                    {formatMoney(price)} ₽
                </Text>
            </View>

            <Text style={styles.amount} numberOfLines={1}>
                {formatAmount(amount, unit)}
            </Text>
        </TouchableOpacity>
    )
}

export default function OrderProductsInfo({ order }: Props) {
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const list = (order.products ?? []) as OrderProductLine[]

    const openProduct = (productId: string) => {
        navigation.navigate('ProductInfo', { productId })
    }

    return (
        <SectionCard title="Товары">
            {list.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>Товаров в этом заказе нет</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {list.map(line => {
                        const productId = line.product?.id
                        return (
                            <Row
                                key={line.id}
                                line={line}
                                onPress={
                                    productId ? () => openProduct(productId) : undefined
                                }
                            />
                        )
                    })}
                </View>
            )}
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    list: { marginTop: 8, rowGap: 15 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
    photo: {
        width: 55,
        height: 55,
        borderRadius: 15,
        backgroundColor: theme.colors.mainPink,
    },
    mid: { flex: 1 },
    name: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
    filling: {
        marginTop: 2,
        fontSize: 13,
        color: theme.colors.mainPink,
        fontFamily: 'Epilogue-Regular',
    },
    price: {
        marginTop: 4,
        fontSize: 13,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
    },
    amount: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        minWidth: 64,
        textAlign: 'right',
    },
    emptyWrap: {
        paddingTop: 10,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
        textAlign: 'center',
    },
})
