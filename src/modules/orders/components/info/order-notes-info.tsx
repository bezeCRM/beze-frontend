import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import type { Order } from '@/shared/types/types'

type Props = { order: Order }

export default function OrderNotesInfo({ order }: Props) {
    const notes = order.notes?.trim() ?? ''
    return (
        <SectionCard title="Примечания">
            <View style={styles.box}>
                <Text style={[styles.text, !notes && styles.muted]}>{notes || '—'}</Text>
            </View>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    box: {
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: theme.colors.mainWhite,
        minHeight: 64,
    },
    text: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        lineHeight: 18,
    },
    muted: { color: theme.colors.mainGray },
})
