import React from 'react'
import { TouchableOpacity } from 'react-native'
import AddPlusIcon from '@/assets/images/add-plus.svg'

type Props = { onPress?: () => void }

export default function AddPlus({ onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <AddPlusIcon width={25} height={25} />
        </TouchableOpacity>
    )
}
