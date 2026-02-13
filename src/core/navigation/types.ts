import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
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

export type Nav = NativeStackNavigationProp<RootStackParamList>

export type Route<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>
