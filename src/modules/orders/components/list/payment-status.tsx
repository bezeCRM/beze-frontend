import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { OrderPaymentStatus } from '@/shared/types/types'
import { theme } from '@/shared/theme'

import ErrorIcon from '@/assets/images/error-icon.svg'
import SuccessIcon from '@/assets/images/success-icon.svg'
import PendingIcon from '@/assets/images/pending-icon.svg'

type Props = {
    status: OrderPaymentStatus
}

function getMeta(status: OrderPaymentStatus) {
    if (status === 'paid') {
        return { label: 'Оплачено', color: theme.colors.successGreen, Icon: SuccessIcon }
    }
    if (status === 'partial') {
        return {
            label: 'Частичная оплата',
            color: theme.colors.inworkYellow,
            Icon: PendingIcon,
        }
    }
    return { label: 'Не оплачено', color: theme.colors.errorRed, Icon: ErrorIcon }
}

export default function PaymentStatus({ status }: Props) {
    const meta = getMeta(status)
    const Icon = meta.Icon

    return (
        <View style={styles.row}>
            <View style={styles.iconWrap}>
                <Icon width={16} height={16} />
            </View>
            <Text style={[styles.text, { color: meta.color }]} numberOfLines={1}>
                {meta.label}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
    },
    iconWrap: {
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 13,
        fontFamily: 'Epilogue-SemiBold',
    },
})
