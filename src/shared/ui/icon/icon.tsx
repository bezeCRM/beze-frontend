import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import CheckmarkIcon from '@/assets/icons/checkmark-icon.svg'
import AddImageIcon from '@/assets/icons/add_image-icon.svg'
import PendingIcon from '@/assets/icons/pending-icon.svg'
import ErrorIcon from '@/assets/icons/error-icon.svg'
import SuccessIcon from '@/assets/icons/success-icon.svg'
import CopyIngredientsIcon from '@/assets/icons/copy_ingredients-icon.svg'
import DeleteItemIcon from '@/assets/icons/delete_item-icon.svg'
import ArrowIcon from '@/assets/icons/arrow-icon.svg'
import SearchIcon from '@/assets/icons/search-icon.svg'
import XIcon from '@/assets/icons/x-icon.svg'
import PlusIcon from '@/assets/icons/plus-icon.svg'
import PlannerIcon from '@/assets/icons/planner-icon.svg'
import ProductsIcon from '@/assets/icons/products-icon.svg'
import OrdersIcon from '@/assets/icons/orders-icon.svg'
import ProfileIcon from '@/assets/icons/profile-icon.svg'

type IconComponent = React.FC<SvgProps>

export type IconName =
    | 'checkmark-icon'
    | 'add_image-icon'
    | 'pending-icon'
    | 'error-icon'
    | 'success-icon'
    | 'copy_ingredients-icon'
    | 'delete_item-icon'
    | 'arrow-icon'
    | 'search-icon'
    | 'x-icon'
    | 'plus-icon'
    | 'planner-icon'
    | 'products-icon'
    | 'orders-icon'
    | 'profile-icon'

const ICONS: Record<IconName, IconComponent> = {
    'checkmark-icon': CheckmarkIcon,
    'add_image-icon': AddImageIcon,
    'pending-icon': PendingIcon,
    'error-icon': ErrorIcon,
    'success-icon': SuccessIcon,
    'copy_ingredients-icon': CopyIngredientsIcon,
    'delete_item-icon': DeleteItemIcon,
    'arrow-icon': ArrowIcon,
    'search-icon': SearchIcon,
    'x-icon': XIcon,
    'plus-icon': PlusIcon,
    'planner-icon': PlannerIcon,
    'products-icon': ProductsIcon,
    'orders-icon': OrdersIcon,
    'profile-icon': ProfileIcon,
}

export type IconProps = {
    name: IconName
    size?: number
    width?: number
    height?: number
    color?: string
    style?: StyleProp<ViewStyle>
    testID?: string

    rotateDeg?: number

    strokeWidth?: number
}

export function Icon({
    name,
    size = 24,
    color,
    style,
    testID,
    rotateDeg,
    strokeWidth = 0,
    width,
    height,
}: IconProps) {
    const Comp = ICONS[name]

    const rotateStyle: StyleProp<ViewStyle> =
        rotateDeg != null ? { transform: [{ rotate: `${rotateDeg}deg` }] } : null

    return (
        <Comp
            testID={testID}
            width={width || size}
            height={height || size}
            color={color}
            stroke={color}
            fill={color}
            strokeWidth={strokeWidth}
            style={[style, rotateStyle]}
        />
    )
}
