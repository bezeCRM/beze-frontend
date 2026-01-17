import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import type { Order } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = { order: Order }

export default function OrderClientInfo({ order }: Props) {
    const styles = useStyles()

    return (
        <SectionCard title="Информация о клиенте" style={{ marginTop: 5 }}>
            <View style={styles.row}>
                <Text style={styles.label}>
                    Имя: <Text style={styles.value}>{order.clientName || '—'}</Text>
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Номер:{' '}
                    <Text style={styles.value}>{order.clientPhone?.trim() || '—'}</Text>
                </Text>
            </View>

            <View style={[styles.row, styles.lastRow]}>
                <Text style={styles.label}>
                    Платформа:{' '}
                    <Text style={styles.value}>{order.orderPlatform?.trim() || '—'}</Text>
                </Text>
            </View>
        </SectionCard>
    )
}

const LINE_H = 20

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        lastRow: { marginBottom: 0 },

        label: {
            fontSize: 16,
            lineHeight: LINE_H,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
            includeFontPadding: false, // android
        },
        value: {
            fontSize: 16,
            lineHeight: LINE_H,
            fontFamily: 'Epilogue-SemiBold',
            color: theme.colors.text,
            includeFontPadding: false, // android
        },
        row: { marginBottom: 8 },
    }),
)
