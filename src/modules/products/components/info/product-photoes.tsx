import { View, Image, StyleSheet } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import { theme } from '@/shared/theme'

type Props = {
    photoes?: string[]
}

export default function ProductPhotoes({ photoes }: Props) {
    return (
        <SectionCard title="Фото товара">
            <View style={styles.row}>
                {photoes?.map((photo, index) => (
                    <Image
                        key={index}
                        source={{ uri: photo }}
                        style={styles.photo}
                    />
                ))}
                {(!photoes || photoes.length === 0) && (
                    <Image
                        source={PlaceholderImage}
                        style={styles.photo}
                    />
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
        marginTop: 5
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: colors.mainPink,
    },
    placeholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
    },
})
