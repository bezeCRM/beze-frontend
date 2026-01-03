import React from 'react'
import { TouchableOpacity } from 'react-native'
import AddPlusIcon from '@/assets/images/add-plus.svg'

type Props = {
    onPress?: () => void
    small?: boolean
}

export default function AddPlus({ onPress, small }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <AddPlusIcon width={small ? 20 : 25} height={small ? 20 : 25} />
        </TouchableOpacity>
    )
}
