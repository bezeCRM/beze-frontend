import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RootNavigation from './root-navigation'
import { layeredSlideFromRight } from './transitions'

import ProductInfoScreen from '@/modules/products/screens/product-info.screen'
import ProductEditScreen from '@/modules/products/screens/product-edit.screen'
import ProductCreateScreen from '@/modules/products/screens/product-create.screen'
import OrderInfoScreen from '@/modules/orders/screens/order-info.screen'
import OrderEditScreen from '@/modules/orders/screens/order-edit.screen'

export type AppStackParamList = {
    Tabs: undefined
    ProductInfo: { productId: string }
    ProductEdit: { productId: string }
    OrderInfo: { orderId: string }
    OrderEdit: { orderId: string }
    ProductCreate: undefined
}

const Stack = createStackNavigator<AppStackParamList>()

export default function AppNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardOverlayEnabled: true,
                cardStyleInterpolator: layeredSlideFromRight,
                gestureResponseDistance: 80,
            }}
        >
            <Stack.Screen name="Tabs" component={RootNavigation} />
            <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
            <Stack.Screen name="OrderInfo" component={OrderInfoScreen} />
            <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
            <Stack.Screen name="ProductCreate" component={ProductCreateScreen} />
            <Stack.Screen name="OrderEdit" component={OrderEditScreen} />
        </Stack.Navigator>
    )
}
