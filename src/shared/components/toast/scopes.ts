import type { AppStackParamList } from '@/core/navigation/types'
import type { RootTabParamList } from '@/core/navigation/root-navigation'

export type ToastScope = keyof AppStackParamList | keyof RootTabParamList

// app stack scopes (экраны поверх табов)
export const APP_STACK_SCOPES = {
    Tabs: 'Tabs',

    ProductInfo: 'ProductInfo',
    ProductEdit: 'ProductEdit',
    ProductCreate: 'ProductCreate',

    OrderInfo: 'OrderInfo',
    OrderEdit: 'OrderEdit',
    OrderCreate: 'OrderCreate',

    Finances: 'Finances',
    Settings: 'Settings',
    Help: 'Help',
} as const satisfies Record<keyof AppStackParamList, ToastScope>

// tab scopes (сами вкладки)
export const ROOT_TAB_SCOPES = {
    Planner: 'Planner',
    Products: 'Products',
    Orders: 'Orders',
    Profile: 'Profile',
} as const satisfies Record<keyof RootTabParamList, ToastScope>

export const TOAST_SCOPES = {
    ...APP_STACK_SCOPES,
    ...ROOT_TAB_SCOPES,
} as const satisfies Record<string, ToastScope>
