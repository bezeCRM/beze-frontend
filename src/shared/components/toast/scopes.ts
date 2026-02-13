// toast/scopes.ts
import type { RootStackParamList } from '@/core/navigation/types'
import type { RootTabParamList } from '@/core/navigation/root-navigation'

export type ToastScope = keyof RootStackParamList | keyof RootTabParamList

// root stack scopes (экраны поверх табов)
export const ROOT_STACK_SCOPES = {
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
} as const satisfies Record<keyof RootStackParamList, ToastScope>

// tab scopes (сами вкладки)
export const ROOT_TAB_SCOPES = {
    Planner: 'Planner',
    Products: 'Products',
    Orders: 'Orders',
    Profile: 'Profile',
} as const satisfies Record<keyof RootTabParamList, ToastScope>

// одиночные константы (удобно импортить)
export const TOAST_SCOPES = {
    ...ROOT_STACK_SCOPES,
    ...ROOT_TAB_SCOPES,
} as const satisfies Record<string, ToastScope>
