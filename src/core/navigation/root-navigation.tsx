import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProductsStack from './products-stack'
import OrdersStack from './orders-stack'
import DevBottomBar from './dev-bottom-bar'

export type RootTabParamList = {
    Products: undefined
    Orders: undefined
}

const Tab = createBottomTabNavigator<RootTabParamList>()

export default function RootNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <DevBottomBar {...props} />}
        >
            <Tab.Screen name="Products" component={ProductsStack} />
            <Tab.Screen name="Orders" component={OrdersStack} />
        </Tab.Navigator>
    )
}
