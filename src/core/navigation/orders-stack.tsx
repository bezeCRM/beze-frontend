import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import OrdersListScreen from '@/modules/orders/screens/orders-list.screen'
import OrderCreateScreen from '@/modules/orders/screens/order-create.screen'
import OrderInfoScreen from '@/modules/orders/screens/order-info.screen'
import OrderEditScreen from '@/modules/orders/screens/order-edit.screen'

export type OrdersStackParamList = {
    OrdersList: undefined
    OrderCreate: undefined
    OrderInfo: { orderId: string }
    OrderEdit: { orderId: string }
    OrderProductInfo: { productId: string }
}

const Stack = createStackNavigator<OrdersStackParamList>()

export default function OrdersStack() {
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
            <Stack.Screen name="OrdersList" component={OrdersListScreen} />
            <Stack.Screen name="OrderCreate" component={OrderCreateScreen} />
            <Stack.Screen name="OrderInfo" component={OrderInfoScreen} />
            <Stack.Screen name="OrderEdit" component={OrderEditScreen} />
        </Stack.Navigator>
    )
}
