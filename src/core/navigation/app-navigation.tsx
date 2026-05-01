import { JSX, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RootNavigation from './root-navigation'

import type { AppStackParamList, AuthStackParamList, RootSwitchParamList } from './types'

import { useAuth } from '@/modules/auth/hooks/useAuth'

import ProductInfoScreen from '@/modules/products/screens/product-info.screen'
import ProductEditScreen from '@/modules/products/screens/product-edit.screen'
import ProductCreateScreen from '@/modules/products/screens/product-create.screen'

import OrderInfoScreen from '@/modules/orders/screens/order-info.screen'
import OrderEditScreen from '@/modules/orders/screens/order-edit.screen'
import OrderCreateScreen from '@/modules/orders/screens/order-create.screen'

import FinancesScreen from '@/modules/profile/screens/finances.screen'
import HelpScreen from '@/modules/profile/screens/help.screen'
import SettingsScreen from '@/modules/profile/screens/settings.screen'
import AuthScreen from '@/modules/auth/screens/auth.screen'
import ResetPasswordScreen from '@/modules/auth/screens/reset-password.screen'
import ForgotPasswordScreen from '@/modules/auth/screens/forgot-password.screen'

const RootStack = createNativeStackNavigator<RootSwitchParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

function AuthStackNavigation(): JSX.Element {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={AuthScreen} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </AuthStack.Navigator>
    )
}

function AppStackNavigation(): JSX.Element {
    return (
        <AppStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
            }}
        >
            <AppStack.Screen name="Tabs" component={RootNavigation} />

            <AppStack.Group>
                <AppStack.Screen name="ProductInfo" component={ProductInfoScreen} />
                <AppStack.Screen name="ProductEdit" component={ProductEditScreen} />
                <AppStack.Screen name="ProductCreate" component={ProductCreateScreen} />

                <AppStack.Screen name="OrderInfo" component={OrderInfoScreen} />
                <AppStack.Screen name="OrderEdit" component={OrderEditScreen} />
                <AppStack.Screen name="OrderCreate" component={OrderCreateScreen} />

                <AppStack.Screen name="Finances" component={FinancesScreen} />
                <AppStack.Screen name="Settings" component={SettingsScreen} />
                <AppStack.Screen name="Help" component={HelpScreen} />
            </AppStack.Group>
        </AppStack.Navigator>
    )
}

export default function AppNavigation(): JSX.Element {
    const { isAuthed, isBootstrapping, bootstrap } = useAuth()

    const bootstrappedRef = useRef(false)
    const [bootstrapped, setBootstrapped] = useState(false)

    useEffect(() => {
        if (bootstrappedRef.current) return
        bootstrappedRef.current = true

        void (async () => {
            await bootstrap()
            setBootstrapped(true)
        })()
    }, [bootstrap])

    if (!bootstrapped || isBootstrapping) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <RootStack.Navigator
            key={isAuthed ? 'root-app' : 'root-auth'}
            screenOptions={{
                headerShown: false,
                animation: 'none',
                gestureEnabled: false,
            }}
        >
            {isAuthed ? (
                <RootStack.Screen name="App" component={AppStackNavigation} />
            ) : (
                <RootStack.Screen name="Auth" component={AuthStackNavigation} />
            )}
        </RootStack.Navigator>
    )
}
