import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import AddPhotoIcon from '@/assets/images/add-photo-icon.svg'
import DeletePhotoIcon from '@/assets/images/delete-photo-icon.svg'
import { theme } from '@/shared/theme'
import type { PhotoItem } from '@/shared/types/types'

type Props = {
    items: PhotoItem[]
    onAddPress?: () => void
    onDeletePress?: (id: string) => void
    maxCount?: number
}

export default function OrderReferencesPicker({
    items,
    onAddPress,
    onDeletePress,
    maxCount = 3,
}: Props) {
    const canAdd = (items?.length ?? 0) < maxCount

    return (
        <SectionCard title="Референсы">
            <View style={styles.row}>
                {items.map(p => (
                    <View key={p.id} style={styles.tileWrap}>
                        <View style={styles.preview}>
                            <Image source={{ uri: p.uri }} style={styles.img} />
                        </View>

                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => onDeletePress?.(p.id)}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            activeOpacity={0.85}
                        >
                            <DeletePhotoIcon width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                ))}

                {canAdd && (
                    <TouchableOpacity
                        style={[styles.tileWrap, styles.addWrap]}
                        onPress={onAddPress}
                        activeOpacity={0.85}
                    >
                        <View style={styles.addTile}>
                            <AddPhotoIcon width={24} height={24} />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </SectionCard>
    )
}

const SIZE = 80
const GAP = 10
const RADIUS = 15
const DELETE_SIZE = 24

const styles = StyleSheet.create({
    row: {
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    tileWrap: {
        marginRight: GAP,
        position: 'relative',
    },
    preview: {
        width: SIZE,
        height: SIZE,
        borderRadius: RADIUS,
        overflow: 'hidden',
        backgroundColor: theme.colors.backgroundWhite,
    },
    img: {
        width: '100%',
        height: '100%',
    },
    delete: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: DELETE_SIZE,
        height: DELETE_SIZE,
        borderRadius: 99,
        backgroundColor: theme.colors.mainWhite,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 2,
    },
    addWrap: { marginRight: 0 },
    addTile: {
        width: SIZE,
        height: SIZE,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: theme.colors.mainGray,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.mainWhite,
    },
})
