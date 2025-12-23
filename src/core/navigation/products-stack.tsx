import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import ProductsListScreen from '@/modules/products/screens/products.screen'
import ProductCreateScreen from '@/modules/products/screens/product-create.screen'
import ProductInfo from '@/modules/products/screens/product-info.screen'

export type ProductsStackParamList = {
    ProductsList: undefined
    ProductCreate: undefined
    ProductInfo: { productId: string }
}

const Stack = createStackNavigator<ProductsStackParamList>()

export default function ProductsStack() {
    return (
        <>
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
                <Stack.Screen name="ProductCreate" component={ProductCreateScreen} />
                <Stack.Screen name="ProductInfo" component={ProductInfo} />
            </Stack.Navigator>
        </>
    )
}
