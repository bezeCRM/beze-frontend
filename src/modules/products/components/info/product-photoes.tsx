import { View, Image, StyleSheet } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import { theme } from '@/shared/theme'
import type { PhotoItem } from '@/shared/types/types'

type Props = {
    photoes?: PhotoItem[]
}

export default function ProductPhotoes({ photoes }: Props) {
    const uris = (photoes ?? [])
        .map(p => (typeof p === 'string' ? p : p?.uri))
        .filter((u): u is string => Boolean(u))

    return (
        <SectionCard title="Фото товара">
            <View style={styles.row}>
                {uris.map((uri, index) => (
                    <Image
                        key={`${uri}-${index}`}
                        source={{ uri }}
                        style={styles.photo}
                    />
                ))}

                {uris.length === 0 && (
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
