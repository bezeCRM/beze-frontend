import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProductsStack from './products-stack'
import OrdersStack from './orders-stack'
import DevBottomBar from './dev-bottom-bar'
import PlannerStack from './planner-stack'
import ProfileStack from './profile-stack'

export type RootTabParamList = {
    Products: undefined
    Orders: undefined
    Planner: undefined
    Profile: undefined
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
            <Tab.Screen name="Planner" component={PlannerStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    )
}
