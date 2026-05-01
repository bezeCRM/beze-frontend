import { ModalProvider } from '@/modules/modal'
import { ToastProvider } from '@/shared/components/toast/toast-provider'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ImageViewerProvider } from './image-viewer.provider'
import { ThemeProvider } from './theme-provider'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { createURL } from 'expo-linking'

type Props = {
    children: React.ReactNode
}

const linking: LinkingOptions<any> = {
    prefixes: [createURL('/')],
    config: {
        screens: {
            Login: {
                screens: {
                    ResetPassword: 'reset-password',
                },
            },
        },
    },
}

export default function AppProviders({ children }: Props) {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <SafeAreaProvider>
                    <ActionSheetProvider>
                        <ToastProvider>
                            <ImageViewerProvider>
                                <ModalProvider />
                                <NavigationContainer linking={linking}>
                                    {children}
                                </NavigationContainer>
                            </ImageViewerProvider>
                        </ToastProvider>
                    </ActionSheetProvider>
                </SafeAreaProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}
