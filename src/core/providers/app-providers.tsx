import { ModalProvider } from '@/modules/modal'
import { ToastProvider } from '@/shared/components/toast/toast-provider'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ImageViewerProvider } from './image-viewer.provider'

type Props = {
    children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
    return (
        <SafeAreaProvider>
            <ToastProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <ImageViewerProvider>
                        <ModalProvider />
                        <NavigationContainer>{children}</NavigationContainer>
                    </ImageViewerProvider>
                </GestureHandlerRootView>
            </ToastProvider>
        </SafeAreaProvider>
    )
}
