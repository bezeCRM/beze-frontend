import { FlatList, View, Text, StyleSheet } from 'react-native'
import type { Order } from '@/shared/types/types'
import Button from '@/shared/ui/button/button'
import OrderCard from './order-card'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OrdersStackParamList } from '@/core/navigation/orders-stack'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    items: Order[]
    emptyTitle?: string
    showCreateButton?: boolean
}

type Nav = StackNavigationProp<OrdersStackParamList>

export default function OrdersList({
    items,
    emptyTitle = 'Заказов пока нет',
    showCreateButton = true,
}: Props) {
    const styles = useStyles()
    const navigation = useNavigation<Nav>()

    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            {showCreateButton ? (
                <Button
                    title="Создать заказ"
                    onPress={() => navigation.navigate('OrderCreate')}
                />
            ) : null}
        </View>
    )

    return (
        <FlatList
            style={styles.list}
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <OrderCard
                    order={item}
                    onPress={() => navigation.navigate('OrderInfo', { orderId: item.id })}
                />
            )}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
                items.length ? undefined : styles.emptyContent,
                { paddingBottom: 105 },
            ]}
            showsVerticalScrollIndicator={false}
        />
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        list: { flex: 1 },
        emptyContent: {
            paddingTop: 30,
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 30,
        },
        emptyWrap: {
            rowGap: 20,
            alignItems: 'center',
        },
        emptyTitle: {
            fontSize: 16,
            color: theme.colors.textMuted,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
