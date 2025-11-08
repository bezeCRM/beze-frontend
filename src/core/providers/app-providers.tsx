import { ToastProvider } from '@/shared/components/toast/toast-provider'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

type Props = {
    children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
    return (
        <SafeAreaProvider>
            <ToastProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainer>{children}</NavigationContainer>
                </GestureHandlerRootView>
            </ToastProvider>
        </SafeAreaProvider>
    )
}
