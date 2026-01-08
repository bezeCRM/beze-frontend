import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { OrdersStackParamList } from '@/core/navigation/orders-stack'
import ScreenContainer from '@/shared/components/layout/screen-container'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import { theme } from '@/shared/theme'

type R = RouteProp<OrdersStackParamList, 'OrderEdit'>
type Nav = StackNavigationProp<OrdersStackParamList, 'OrderEdit'>

export default function OrderEditScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    useRoute<R>()

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <InternalHeaderTopBar onBack={() => navigation.goBack()} />
                <InternalHeaderTitle title="Изменение заказа" />
                <View style={[styles.body, { paddingBottom: bottom + 30 }]}>
                    <Text style={styles.text}>
                        Экран редактирования заказа будет здесь.
                    </Text>
                </View>
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundWhite },
    body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: {
        fontSize: 14,
        color: theme.colors.mainGray,
        fontFamily: 'Epilogue-Regular',
    },
})
