import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductsListScreen from '../../modules/products/screens/products.screen'

export type ProductsStackParamList = {
    ProductsList: undefined
}

const Stack = createNativeStackNavigator<ProductsStackParamList>()

export default function ProductsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right', // простая iOS-анимация
            }}
        >
            <Stack.Screen name="ProductsList" component={ProductsListScreen} />
        </Stack.Navigator>
    )
}
