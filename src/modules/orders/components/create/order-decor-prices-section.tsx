import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import type { OrderCreateItem } from '../../hooks/useOrderCreateForm'

type Props = {
    items: OrderCreateItem[]
    onChange: (itemId: string, v: string) => void
    onAddPress?: () => void
}

function Row({
    title,
    value,
    onChangeText,
}: {
    title: string
    value: string
    onChangeText: (t: string) => void
}) {
    return (
        <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
                {title}
            </Text>

            <View style={styles.right}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.input}
                    keyboardType="numeric"
                    returnKeyType="done"
                />
                <Text style={styles.ruble}>₽</Text>
            </View>
        </View>
    )
}

export default function OrderDecorPricesSection({ items, onChange, onAddPress }: Props) {
    if (items.length === 0) {
        return (
            <SectionCard title="Стоимость декора">
                <View style={styles.decorEmptyWrap}>
                    <Text style={styles.decorEmptyText}>Товаров пока не добавлено</Text>

                    <TouchableOpacity
                        style={[
                            styles.decorEmptyBtn,
                            !onAddPress && styles.decorEmptyBtnDisabled,
                        ]}
                        onPress={onAddPress}
                        activeOpacity={0.85}
                        disabled={!onAddPress}
                    >
                        <Text
                            style={[
                                styles.decorEmptyBtnText,
                                !onAddPress && styles.decorEmptyBtnTextDisabled,
                            ]}
                        >
                            Добавить товар
                        </Text>
                    </TouchableOpacity>
                </View>
            </SectionCard>
        )
    }

    return (
        <SectionCard title="Стоимость декора">
            <View style={styles.list}>
                {items.map(it => (
                    <Row
                        key={it.id}
                        title={it.product?.name ?? 'Товар'}
                        value={String(it.decorPrice ?? '')}
                        onChangeText={t => onChange(it.id, t)}
                    />
                ))}
            </View>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    list: { gap: 12 },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 12,
    },
    name: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    input: {
        width: 70,
        height: 34,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.mainWhite,
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    ruble: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },

    decorEmptyWrap: {
        marginTop: 6,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 12,
    },
    decorEmptyText: {
        fontSize: 14,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
        textAlign: 'center',
    },
    decorEmptyBtn: {
        height: 36,
        paddingHorizontal: 18,
        borderRadius: 15,
        backgroundColor: theme.colors.mainPink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    decorEmptyBtnText: {
        fontSize: 14,
        color: theme.colors.mainWhite,
        fontFamily: 'Epilogue-SemiBold',
    },
    decorEmptyBtnDisabled: { backgroundColor: theme.colors.lineGray },
    decorEmptyBtnTextDisabled: { color: theme.colors.mainGray },
})
