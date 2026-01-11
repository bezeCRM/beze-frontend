import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { theme } from '@/shared/theme'
import { formatMoneyRu } from '@/modules/orders/utils/money'

type Props = {
    paidAmountText: string
    onChangePaidAmountText: (t: string) => void
    onBlur: () => void
    remaining: number
    hasError?: boolean
}

export default function PartialPaymentRow({
    paidAmountText,
    onChangePaidAmountText,
    onBlur,
    remaining,
    hasError,
}: Props) {
    return (
        <View style={styles.payRow}>
            <View style={styles.payLeft}>
                <Text style={styles.payLabel}>Получено</Text>

                <View style={[styles.payInputWrap, hasError && styles.payInputErrorWrap]}>
                    <TextInput
                        value={paidAmountText}
                        onChangeText={onChangePaidAmountText}
                        onBlur={onBlur}
                        keyboardType="numeric"
                        style={styles.payInput}
                        returnKeyType="done"
                    />
                    <Text style={styles.payCurrency}>₽</Text>
                </View>
            </View>

            <View style={styles.payRight}>
                <Text style={styles.payLabel}>Остаток</Text>
                <Text style={styles.payRemain}>{formatMoneyRu(remaining)} ₽</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    payRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 5,
        marginTop: -5,
    },
    payLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
    payRight: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },

    payLabel: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    payInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.mainWhite,
    },
    payInputErrorWrap: { borderColor: theme.colors.errorRed },
    payInput: {
        minWidth: 45,
        maxWidth: 85,
        textAlign: 'center',
        fontSize: 18,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        paddingVertical: 0,
    },
    payCurrency: {
        marginLeft: 6,
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    payRemain: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
})
