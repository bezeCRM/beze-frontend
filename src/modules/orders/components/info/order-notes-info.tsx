import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import type { Order } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = { order: Order }

export default function OrderNotesInfo({ order }: Props) {
    const styles = useStyles()
    const notes = order.notes?.trim() ?? ''
    return (
        <SectionCard title="Примечания">
            <View style={styles.box}>
                <Text style={[styles.text, !notes && styles.muted]}>{notes || '—'}</Text>
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        box: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: theme.colors.surface,
            minHeight: 64,
        },
        text: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
            lineHeight: 18,
        },
        muted: { color: theme.colors.textMuted },
    }),
)
