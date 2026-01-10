import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import type { Order } from '@/shared/types/types'

type Props = { order: Order }

export default function OrderClientInfo({ order }: Props) {
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

const styles = StyleSheet.create({
    lastRow: { marginBottom: 0 },

    label: {
        fontSize: 16,
        lineHeight: LINE_H,
        fontFamily: 'Epilogue-Regular',
        color: theme.colors.mainBlack,
        includeFontPadding: false, // android
    },
    value: {
        fontSize: 16,
        lineHeight: LINE_H,
        fontFamily: 'Epilogue-SemiBold',
        color: theme.colors.mainBlack,
        includeFontPadding: false, // android
    },
    row: { marginBottom: 8 },
})
