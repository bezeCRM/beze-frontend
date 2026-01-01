import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import AddPhotoIcon from '@/assets/images/add-photo-icon.svg'
import DeletePhotoIcon from '@/assets/images/delete-photo-icon.svg'
import { theme } from '@/shared/theme'

type Photo = { id: string; uri: string }

type Props = {
    photoes: Photo[]
    onAddPress?: () => void
    onDeletePress?: (id: string) => void
    onPhotoPress?: (payload: { id: string; uri: string; index: number }) => void
    maxCount?: number
}

export default function PhotoesPicker({
    photoes,
    onAddPress,
    onDeletePress,
    onPhotoPress,
    maxCount = 3,
}: Props) {
    const canAdd = (photoes?.length ?? 0) < maxCount

    return (
        <SectionCard title="Фото товара">
            <View style={styles.row}>
                {photoes.map((p, index) => (
                    <View key={p.id} style={styles.tileWrap}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                onPhotoPress?.({ id: p.id, uri: p.uri, index })
                            }
                            style={styles.preview}
                        >
                            <Image source={{ uri: p.uri }} style={styles.img} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => onDeletePress?.(p.id)}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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

const { colors } = theme

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
        backgroundColor: colors.backgroundWhite,
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
        backgroundColor: colors.mainWhite,
        resizeMode: 'contain',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 2,
    },

    addWrap: {
        marginRight: 0,
    },
    addTile: {
        width: SIZE,
        height: SIZE,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: colors.mainGray,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mainWhite,
    },
})
