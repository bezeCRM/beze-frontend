import { createStackNavigator } from '@react-navigation/stack'
import { layeredSlideFromRight } from './transitions'
import ProfileScreen from '@/modules/profile/screens/profile.screen'

export type ProfileStackParamList = {
    ProfileHome: undefined
}

const Stack = createStackNavigator<ProfileStackParamList>()
export default function ProfileStack() {
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
            <Stack.Screen name="ProfileHome" component={ProfileScreen} />
        </Stack.Navigator>
    )
}
