import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

export type RootSwitchParamList = {
    Auth: undefined
    App: undefined
    ResetPassword: { token?: string }
}

export type AuthStackParamList = {
    Login: undefined
    ForgotPassword: undefined
}

export type AppStackParamList = {
    Tabs: undefined

    ProductInfo: { productId: string }
    ProductEdit: { productId: string }
    ProductCreate: undefined

    OrderInfo: { orderId: string }
    OrderEdit: { orderId: string }
    OrderCreate: undefined

    Finances: undefined
    Settings: undefined
    Help: undefined
}

export type Nav = NativeStackNavigationProp<AppStackParamList>

export type AuthNav = NativeStackNavigationProp<AuthStackParamList>

export type RootNav = NativeStackNavigationProp<RootSwitchParamList>

export type Route<T extends keyof AppStackParamList> = RouteProp<AppStackParamList, T>
