import React, { useMemo } from 'react'
import { View, Image, StyleSheet, Pressable } from 'react-native'

import SectionCard from '@/shared/ui/section/section-card'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import { theme } from '@/shared/theme'
import type { PhotoItem } from '@/shared/types/types'
import { useImageViewer } from '@/shared/hooks/useImageViewer'

type Props = {
    photoes?: PhotoItem[]
}

export default function ProductPhotoes({ photoes }: Props) {
    const input = useMemo(
        () =>
            (photoes ?? [])
                .map(p => (typeof p === 'string' ? p : p?.uri))
                .filter((u): u is string => Boolean(u))
                .slice(0, 3),
        [photoes],
    )

    const viewer = useImageViewer(input, 3)

    return (
        <SectionCard title="Фото товара">
            <View style={styles.row}>
                {viewer.uris.map((uri, idx) => (
                    <Pressable key={`${uri}-${idx}`} onPress={() => viewer.openAt(idx)}>
                        <Image source={{ uri }} style={styles.photo} />
                    </Pressable>
                ))}

                {viewer.uris.length === 0 && (
                    <Image source={PlaceholderImage} style={styles.photo} />
                )}
            </View>
        </SectionCard>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: colors.mainPink,
    },
})
