import React, { useMemo } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ImageSourcePropType,
} from 'react-native'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import type { Product, PhotoItem } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type ProductCardProps = Pick<
    Product,
    'id' | 'name' | 'price' | 'fillings' | 'photoes'
> & {
    onPress?: () => void
}

function getFirstPhotoUri(photoes?: PhotoItem[]) {
    if (!photoes?.length) return null
    for (const p of photoes) {
        if (typeof p === 'string') {
            if (p) return p
        } else if (p?.uri) {
            return p.uri
        }
    }
    return null
}

export default function ProductCard({
    name,
    fillings,
    price,
    photoes,
    onPress,
}: ProductCardProps) {
    const styles = useStyles()
    const imageSource: ImageSourcePropType = useMemo(() => {
        const firstUri = getFirstPhotoUri(photoes as unknown as PhotoItem[])
        return firstUri ? { uri: firstUri } : PlaceholderImage
    }, [photoes])

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image source={imageSource} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                {!!fillings?.length && (
                    <Text style={styles.fillings} numberOfLines={1}>
                        {fillings.map(f => f.name).join(', ')}
                    </Text>
                )}
            </View>
            <Text style={styles.price}>{price.toLocaleString('ru-RU')} ₽</Text>
        </TouchableOpacity>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            borderRadius: 15,
            paddingVertical: 8,
        },
        image: {
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: theme.colors.brand,
        },
        info: {
            flex: 1,
            marginHorizontal: 15,
        },
        name: {
            fontSize: 16,
            lineHeight: 17.6,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        fillings: {
            fontSize: 14,
            color: theme.colors.brand,
            fontFamily: 'Epilogue-Regular',
            marginTop: 5,
        },
        price: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
