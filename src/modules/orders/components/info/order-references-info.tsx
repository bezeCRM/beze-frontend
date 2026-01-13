import React, { useMemo } from 'react'
import { Image, StyleSheet, View, Text, Pressable } from 'react-native'

import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import type { Order, PhotoItem } from '@/shared/types/types'
import { useImageViewer } from '@/shared/hooks/useImageViewer'

type Props = { order: Order }

export default function OrderReferencesInfo({ order }: Props) {
    const input = useMemo(
        () =>
            (order.references ?? [])
                .map(p => (typeof p === 'string' ? p : (p as PhotoItem)?.uri))
                .filter((u): u is string => Boolean(u))
                .slice(0, 3),
        [order.references],
    )

    const viewer = useImageViewer(input, 3)

    return (
        <SectionCard title="Референсы">
            <View style={styles.row}>
                {viewer.uris.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyText}>Референсов в этом заказе нет</Text>
                    </View>
                ) : (
                    <>
                        {viewer.uris.map((uri, idx) => (
                            <Pressable
                                key={`${uri}-${idx}`}
                                onPress={() => viewer.openAt(idx)}
                            >
                                <Image source={{ uri }} style={styles.photo} />
                            </Pressable>
                        ))}
                    </>
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
    emptyWrap: {
        paddingTop: 10,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
        textAlign: 'center',
    },
})
