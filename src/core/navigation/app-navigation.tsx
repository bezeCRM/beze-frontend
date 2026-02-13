import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RootNavigation from './root-navigation'

import ProductInfoScreen from '@/modules/products/screens/product-info.screen'
import ProductEditScreen from '@/modules/products/screens/product-edit.screen'
import ProductCreateScreen from '@/modules/products/screens/product-create.screen'

import OrderInfoScreen from '@/modules/orders/screens/order-info.screen'
import OrderEditScreen from '@/modules/orders/screens/order-edit.screen'
import OrderCreateScreen from '@/modules/orders/screens/order-create.screen'

import FinancesScreen from '@/modules/profile/screens/finances.screen'
import { RootStackParamList } from './types'
import HelpScreen from '@/modules/profile/screens/help.screen'
import SettingsScreen from '@/modules/profile/screens/settings.screen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="Tabs" component={RootNavigation} />

            <Stack.Group>
                <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
                <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
                <Stack.Screen name="ProductCreate" component={ProductCreateScreen} />

                <Stack.Screen name="OrderInfo" component={OrderInfoScreen} />
                <Stack.Screen name="OrderEdit" component={OrderEditScreen} />
                <Stack.Screen name="OrderCreate" component={OrderCreateScreen} />

                <Stack.Screen name="Finances" component={FinancesScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
            </Stack.Group>
        </Stack.Navigator>
    )
}
