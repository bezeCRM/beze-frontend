import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { formatMoney } from '../../utils/order-format'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = { totalPrice: number }

export default function OrderTotalRow({ totalPrice }: Props) {
    const styles = useStyles()
    return (
        <View style={styles.row}>
            <Text style={styles.label}>Итоговая стоимость:</Text>
            <Text style={styles.value}>{formatMoney(totalPrice)} ₽</Text>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 3,
            marginTop: 3,
            marginBottom: 5,
        },
        label: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        value: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
    }),
)
