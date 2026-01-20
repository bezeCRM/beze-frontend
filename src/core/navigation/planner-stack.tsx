import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import PlannerScreen from '@/modules/planner/screens/planner.screen'

export type PlannerStackParamList = {
    PlannerHome: undefined
}

const Stack = createStackNavigator<PlannerStackParamList>()

export default function PlannerStack() {
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
            <Stack.Screen name="PlannerHome" component={PlannerScreen} />
        </Stack.Navigator>
    )
}
