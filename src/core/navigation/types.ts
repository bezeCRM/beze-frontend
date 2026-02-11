import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppStackParamList } from './app-navigation'
import type { RouteProp } from '@react-navigation/native'

export type RootStackParamList = {
    Tabs: undefined

    ProductInfo: { productId: string }
    ProductEdit: { productId: string }
    ProductCreate: undefined

    OrderInfo: { orderId: string }
    OrderEdit: { orderId: string }
    OrderCreate: undefined
}

export type Nav = NativeStackNavigationProp<AppStackParamList>

export type Route<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>
