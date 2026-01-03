import { FlatList, View, Text, StyleSheet } from 'react-native'
import type { Order } from '@/shared/types/types'
import Button from '@/shared/ui/button/button'
import OrderCard from './order-card'
import { theme } from '@/shared/theme'
import { useNavigation } from '@react-navigation/native'

type Props = { items: Order[] }

export default function OrdersList({ items }: Props) {
    const navigation = useNavigation<any>()

    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Заказов пока нет</Text>
            <Button
                title="Создать заказ"
                onPress={() => navigation.navigate('OrderCreate')}
            />
        </View>
    )

    return (
        <FlatList
            style={styles.list}
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={items.length ? undefined : styles.emptyContent}
            showsVerticalScrollIndicator={false}
        />
    )
}

const { colors } = theme

const styles = StyleSheet.create({
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
        color: colors.mainGray,
        fontFamily: 'Epilogue-Regular',
    },
})
