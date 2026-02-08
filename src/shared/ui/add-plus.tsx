import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from './icon/icon'
import { useTheme } from '../theme/useTheme'

type Props = {
    onPress?: () => void
    small?: boolean
    color?: string
}

export default function AddPlus({ onPress, small, color }: Props) {
    const colors = useTheme().theme.colors
    const size = small ? 20 : 28
    const plusColor = color || colors.brand
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Icon name="plus-icon" size={size} color={plusColor} />
        </TouchableOpacity>
    )
}
