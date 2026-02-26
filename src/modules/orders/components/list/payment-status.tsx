import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { IconName } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Icon } from '@/shared/ui/icon/icon'

type Props = {
    status: string
}
type GetMetaReturn = {
    label: string
    iconName: IconName
    color: string
}

function GetMeta(status: string): GetMetaReturn {
    const colors = useTheme().theme.colors

    if (status === 'paid') {
        return { label: 'Оплачен', iconName: 'success-icon', color: colors.success }
    }
    if (status === 'partial') {
        return {
            label: 'Частичная оплата',
            iconName: 'pending-icon',
            color: colors.warning,
        }
    }
    return { label: 'Не оплачен', iconName: 'error-icon', color: colors.danger }
}

export default function PaymentStatus({ status }: Props) {
    const styles = useStyles()
    const meta = GetMeta(status)

    return (
        <View style={styles.row}>
            <View style={styles.iconWrap}>
                <Icon name={meta.iconName} size={16} />
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
