import React, { useMemo } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type ImageSourcePropType,
} from 'react-native'
import PlaceholderImage from '@/assets/images/product-card-placeholder.png'
import DeleteItemIcon from '@/assets/images/delete_item-icon.svg'
import { theme } from '@/shared/theme'
import type { OrderCreateItem } from '../../hooks/useOrderCreateForm'
import type { PhotoItem } from '@/shared/types/types'
import Minus from '@/assets/images/minus.svg'
import Plus from '@/assets/images/plus.svg'

type Props = {
    item: OrderCreateItem
    onInc: () => void
    onDec: () => void
    onChangeWeight: (v: string) => void
    onRemove: () => void
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

export default function OrderProductRow({
    item,
    onInc,
    onDec,
    onChangeWeight,
    onRemove,
}: Props) {
    const product = item.product
    const unit = product.unit

    const imageSource: ImageSourcePropType = useMemo(() => {
        const uri = getFirstPhotoUri(product.photoes as unknown as PhotoItem[])
        return uri ? { uri } : PlaceholderImage
    }, [product.photoes])

    return (
        <View style={styles.row}>
            <TouchableOpacity
                onPress={onRemove}
                activeOpacity={0.85}
                style={styles.removeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <DeleteItemIcon width={20} height={20} />
            </TouchableOpacity>

            <Image source={imageSource} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                </Text>

                {!!item.filling?.name && (
                    <Text style={styles.filling} numberOfLines={1}>
                        {item.filling.name}
                    </Text>
                )}

                <Text style={styles.price}>
                    {product.price.toLocaleString('ru-RU')} ₽/
                    {unit === 'kg' ? 'кг' : 'шт'}
                </Text>
            </View>

            {unit === 'kg' ? (
                <View style={styles.kgWrap}>
                    <TextInput
                        value={item.weightKg}
                        onChangeText={onChangeWeight}
                        style={styles.kgInput}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                    <Text style={styles.kgText}>кг</Text>
                </View>
            ) : (
                <View style={styles.stepper}>
                    <Minus
                        style={styles.stepBtn}
                        onPress={onDec}
                        activeOpacity={0.85}
                        width={28}
                        height={28}
                    />

                    <Text style={styles.count}>{item.count}</Text>

                    <Plus
                        style={styles.stepBtn}
                        onPress={onInc}
                        activeOpacity={0.85}
                        width={28}
                        height={28}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    removeBtn: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
    },

    image: {
        width: 55,
        height: 55,
        borderRadius: 15,
        backgroundColor: theme.colors.mainPink,
    },

    info: {
        flex: 1,
        marginLeft: 14,
        marginRight: 12,
        gap: 4,
    },

    name: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
    filling: {
        fontSize: 12,
        color: theme.colors.mainPink,
        fontFamily: 'Epilogue-Regular',
    },
    price: {
        fontSize: 13,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
    },

    kgWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    kgInput: {
        width: 54,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.mainWhite,
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    kgText: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },

    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
    },
    stepBtn: {
        width: 32,
        height: 32,
        borderRadius: 17,
        backgroundColor: theme.colors.mainGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepSymbol: {
        fontSize: 24,
        lineHeight: 18,
        color: theme.colors.mainWhite,
        fontFamily: 'Epilogue-SemiBold',
        marginTop: 5,
    },
    count: {
        width: 25.5,
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
})
