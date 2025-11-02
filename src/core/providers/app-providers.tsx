import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

type Props = {
    children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NavigationContainer>{children}</NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
