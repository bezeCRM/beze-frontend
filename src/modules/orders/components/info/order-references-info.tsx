import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import type { Order, PhotoItem } from '@/shared/types/types'

type Props = { order: Order }

export default function OrderReferencesInfo({ order }: Props) {
    const uris = (order.references ?? [])
        .map(p => (typeof p === 'string' ? p : (p as PhotoItem)?.uri))
        .filter((u): u is string => Boolean(u))
        .slice(0, 3)

    return (
        <SectionCard title="Референсы">
            <View style={styles.row}>
                {uris.map((uri, idx) => (
                    <Image key={`${uri}-${idx}`} source={{ uri }} style={styles.photo} />
                ))}

                {uris.length === 0 && (
                    <Image source={PlaceholderImage} style={styles.photo} />
                )}
            </View>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 10, marginTop: 3 },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: theme.colors.mainPink,
    },
})
