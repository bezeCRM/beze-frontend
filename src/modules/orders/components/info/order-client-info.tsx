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
                <Text style={styles.label}>Имя:&nbsp;</Text>
                <Text style={styles.value}>{order.clientName || '—'}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Номер:&nbsp;</Text>
                <Text style={styles.value}>{order.clientPhone?.trim() || '—'}</Text>
            </View>

            <View style={[styles.row, styles.lastRow]}>
                <Text style={styles.label}>Платформа:&nbsp;</Text>
                <Text style={styles.value}>{order.orderPlatform?.trim() || '—'}</Text>
            </View>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    lastRow: { marginBottom: 0 },
    label: {
        fontSize: 16,
        fontFamily: 'Epilogue-Regular',
        color: theme.colors.mainBlack,
    },
    value: {
        fontSize: 16,
        fontFamily: 'Epilogue-SemiBold',
        color: theme.colors.mainBlack,
    },
})
