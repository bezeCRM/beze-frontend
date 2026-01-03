import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import OrdersListScreen from '@/modules/orders/screens/orders-list.screen'
import OrderCreateScreen from '@/modules/orders/screens/order-create.screen'

export type OrdersStackParamList = {
    OrdersList: undefined
    OrderCreate: undefined
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
        </Stack.Navigator>
    )
}
