import React, { useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import SectionCard from '@/shared/ui/section/section-card'
import { useImageViewer } from '@/shared/hooks/useImageViewer'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Icon } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'

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
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const input = useMemo(
        () => (photoes ?? []).map(p => p.uri).filter(Boolean),
        [photoes],
    )
    const viewer = useImageViewer(input, maxCount)

    const canAdd = (photoes?.length ?? 0) < maxCount

    return (
        <SectionCard title="Фото товара">
            <View style={styles.row}>
                {photoes.map((p, index) => (
                    <View key={p.id} style={styles.tileWrap}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                viewer.openAt(index)
                                onPhotoPress?.({ id: p.id, uri: p.uri, index })
                            }}
                            style={styles.preview}
                        >
                            <Image source={{ uri: p.uri }} style={styles.img} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => onDeletePress?.(p.id)}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <Icon name="x-icon" size={12} color={colors.text} />
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
                            <Icon name="add_image-icon" size={24} />
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

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
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
            backgroundColor: theme.colors.background,
        },

        img: {
            width: '100%',
            height: '100%',
        },

        delete: {
            position: 'absolute',
            top: -4,
            right: -4,
            justifyContent: 'center',
            alignItems: 'center',
            width: DELETE_SIZE,
            height: DELETE_SIZE,
            borderRadius: 99,
            backgroundColor: theme.colors.surface,
            resizeMode: 'contain',
            shadowColor: theme.colors.surface,
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
            borderColor: theme.colors.textMuted,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
        },
    }),
)
