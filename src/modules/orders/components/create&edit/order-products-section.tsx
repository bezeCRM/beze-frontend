import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import AddPlus from '@/shared/ui/add-plus'
import { theme } from '@/shared/theme'
import type { OrderCreateItem } from '../../hooks/useOrderCreateForm'
import OrderProductRow from './order-product-row'

type Props = {
    items: OrderCreateItem[]
    onAddPress?: () => void
    onInc: (id: string) => void
    onDec: (id: string) => void
    onChangeWeight: (id: string, v: string) => void
    onRemove: (id: string) => void
}

export default function OrderProductsSection({
    items,
    onAddPress,
    onInc,
    onDec,
    onChangeWeight,
    onRemove,
}: Props) {
    const empty = items.length === 0

    return (
        <SectionCard title="Товары">
            <View style={styles.addBtn}>
                <AddPlus onPress={onAddPress} small />
            </View>

            {empty ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>Товаров к заказу не добавлено</Text>

                    <TouchableOpacity
                        onPress={onAddPress}
                        activeOpacity={0.85}
                        disabled={!onAddPress}
                        style={[styles.emptyBtn, !onAddPress && styles.emptyBtnDisabled]}
                    >
                        <Text
                            style={[
                                styles.emptyBtnText,
                                !onAddPress && styles.emptyBtnTextDisabled,
                            ]}
                        >
                            Добавить товар
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.list}>
                    {items.map(it => (
                        <OrderProductRow
                            key={it.id}
                            item={it}
                            onInc={() => onInc(it.id)}
                            onDec={() => onDec(it.id)}
                            onChangeWeight={v => onChangeWeight(it.id, v)}
                            onRemove={() => onRemove(it.id)}
                        />
                    ))}
                </View>
            )}
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    addBtn: { position: 'absolute', right: 0, top: -27 },

    list: {
        marginTop: 6,
        gap: 18,
    },

    emptyWrap: {
        marginTop: 6,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
        textAlign: 'center',
    },
    emptyBtn: {
        height: 36,
        paddingHorizontal: 18,
        borderRadius: 15,
        backgroundColor: theme.colors.mainPink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBtnText: {
        fontSize: 14,
        color: theme.colors.mainWhite,
        fontFamily: 'Epilogue-SemiBold',
    },
    emptyBtnDisabled: { backgroundColor: theme.colors.lineGray },
    emptyBtnTextDisabled: { color: theme.colors.mainGray },
})
