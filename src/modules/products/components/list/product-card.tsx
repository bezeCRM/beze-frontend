import React, { useMemo } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import { theme } from '@/shared/theme'
import type { Product } from '@/shared/types/types'

type ProductCardProps = Pick<
    Product,
    'id' | 'name' | 'price' | 'fillings' | 'photoes'
> & {
    onPress?: () => void
}

export default function ProductCard({
    name,
    fillings,
    price,
    photoes,
    onPress,
}: ProductCardProps) {
    const imageSource = useMemo(() => {
        const firstUri = photoes?.find(Boolean)
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

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundWhite,
        borderRadius: 15,
        paddingVertical: 8,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: theme.colors.mainPink,
    },
    info: {
        flex: 1,
        marginHorizontal: 15,
    },
    name: {
        fontSize: 16,
        lineHeight: 17.6,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
    fillings: {
        fontSize: 14,
        color: theme.colors.mainPink,
        fontFamily: 'Epilogue-Regular',
        marginTop: 5,
    },
    price: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
})
