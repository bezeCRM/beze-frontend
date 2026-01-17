import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { OrderPaymentStatus } from '@/shared/types/types'

import ErrorIcon from '@/assets/images/error-icon.svg'
import SuccessIcon from '@/assets/images/success-icon.svg'
import PendingIcon from '@/assets/images/pending-icon.svg'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    status: OrderPaymentStatus
}

function GetMeta(status: OrderPaymentStatus) {
    const colors = useTheme().theme.colors

    if (status === 'paid') {
        return { label: 'Оплачено', color: colors.success, Icon: SuccessIcon }
    }
    if (status === 'partial') {
        return {
            label: 'Частичная оплата',
            color: colors.warning,
            Icon: PendingIcon,
        }
    }
    return { label: 'Не оплачено', color: colors.danger, Icon: ErrorIcon }
}

export default function PaymentStatus({ status }: Props) {
    const styles = useStyles()
    const meta = GetMeta(status)
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

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
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
    }),
)
