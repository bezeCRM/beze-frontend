import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import ProductsListScreen from '@/modules/products/screens/products-list.screen'

export type ToastNavPayload = {
    message: string
    variant?: 'error' | 'info' | 'success'
}

export type ProductsListParams = {
    toast?: ToastNavPayload
    deletedProduct?: { id: string; name: string }
}

export type ProductsStackParamList = {
    ProductsList: ProductsListParams | undefined
}

const Stack = createStackNavigator<ProductsStackParamList>()

export default function ProductsStack() {
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
            <Stack.Screen name="ProductsList" component={ProductsListScreen} />
        </Stack.Navigator>
    )
}
