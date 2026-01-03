import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import ProductsListScreen from '@/modules/products/screens/products-list.screen'
import ProductCreateScreen from '@/modules/products/screens/product-create.screen'
import ProductInfoScreen from '@/modules/products/screens/product-info.screen'
import ProductEditScreen from '@/modules/products/screens/product-edit.screen'

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
    ProductCreate: undefined
    ProductInfo: { productId: string }
    ProductEdit: { productId: string }
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
            <Stack.Screen name="ProductCreate" component={ProductCreateScreen} />
            <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
            <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
        </Stack.Navigator>
    )
}
