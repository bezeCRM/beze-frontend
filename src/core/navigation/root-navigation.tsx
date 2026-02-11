import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DevBottomBar from './bottom-menu'

import OrdersListScreen from '@/modules/orders/screens/orders-list.screen'
import ProductsListScreen from '@/modules/products/screens/products-list.screen'
import PlannerScreen from '@/modules/planner/screens/planner.screen'
import ProfileScreen from '@/modules/profile/screens/profile.screen'

export type RootTabParamList = {
    Planner: undefined
    Products: undefined
    Orders: undefined
    Profile: undefined
}

const Tab = createBottomTabNavigator<RootTabParamList>()

export default function RootNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <DevBottomBar {...props} />}
        >
            <Tab.Screen name="Planner" component={PlannerScreen} />
            <Tab.Screen name="Products" component={ProductsListScreen} />
            <Tab.Screen name="Orders" component={OrdersListScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}
