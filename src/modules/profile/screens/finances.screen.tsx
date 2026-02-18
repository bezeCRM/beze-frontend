import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ScreenContainer from '@/shared/components/layout/screen-container'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import FinancesHeader from '../components/finances/finances-header'

import { useOrdersStore } from '@/modules/orders/store/orders.store'
import {
    calcAverageCheck,
    calcExpectedRest,
    calcPaidOrdersCount,
    calcReceivedRevenue,
    FinancePeriod,
    getLargestOrderInPeriod,
} from '../utils/revenue'
import OrderCard from '@/modules/orders/components/list/order-card'
import { Icon } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'

export default function FinancesScreen({ navigation }: any) {
    const { bottom } = useSafeAreaInsets()
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const [isMonthActive, setIsMonthActive] = useState(true)

    const orders = useOrdersStore(s => s.orders)

    const period: FinancePeriod = isMonthActive ? 'month' : 'year'

    const revenue = useMemo(() => calcReceivedRevenue(orders, period), [orders, period])
    const expected = useMemo(() => calcExpectedRest(orders, period), [orders, period])
    const avgCheck = useMemo(() => calcAverageCheck(orders, period), [orders, period])

    const lastPayments = useMemo(() => {
        return (orders ?? [])
            .filter(
                o =>
                    (o.paymentStatus === 'paid' || o.paymentStatus === 'partial') &&
                    o.status !== 'canceled',
            )
            .filter(o => !!o.lastPaymentAt)
            .slice()
            .sort(
                (a, b) =>
                    (Date.parse(b.lastPaymentAt!) || 0) -
                    (Date.parse(a.lastPaymentAt!) || 0),
            )
            .slice(0, 3)
    }, [orders])

    const paidOrdersCount = useMemo(
        () => calcPaidOrdersCount(orders, period),
        [orders, period],
    )

    const largestOrder = useMemo(
        () => getLargestOrderInPeriod(orders, period),
        [orders, period],
    )

    return (
        <ScreenContainer>
            <FinancesHeader
                monthActive={isMonthActive}
                onMonthPress={() => setIsMonthActive(true)}
                onYearPress={() => setIsMonthActive(false)}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: bottom + 30 }}
                style={styles.container}
            >
                <SectionCard
                    title={`Выручка в этом ${isMonthActive ? 'месяце' : 'году'}`}
                    style={styles.statsCard}
                >
                    <Text style={styles.bigText} numberOfLines={1}>
                        {revenue.toLocaleString('ru-RU')} ₽
                    </Text>
                </SectionCard>

                <SectionCard
                    title={`Ожидается в этом ${isMonthActive ? 'месяце' : 'году'}`}
                    style={styles.statsCard}
                >
                    <Text style={styles.bigText} numberOfLines={1}>
                        ещё {expected.toLocaleString('ru-RU')} ₽
                    </Text>
                </SectionCard>

                <SectionCard
                    title="Средний чек заказа"
                    style={StyleSheet.flatten([styles.statsCard, { marginBottom: 0 }])}
                >
                    <Text style={styles.bigText} numberOfLines={1}>
                        {avgCheck.toLocaleString('ru-RU')} ₽
                    </Text>
                </SectionCard>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Последние оплаты</Text>

                    <View style={styles.lastPayments}>
                        {lastPayments.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>Оплат пока нет</Text>
                            </View>
                        ) : (
                            lastPayments.map(item => (
                                <OrderCard
                                    key={item.id}
                                    order={item}
                                    onPress={() =>
                                        navigation.navigate('OrderInfo', {
                                            orderId: item.id,
                                        })
                                    }
                                />
                            ))
                        )}
                    </View>
                </View>

                <View style={[styles.box, { marginTop: 10 }]}>
                    <Text style={styles.boxTitle}>Дополнительно</Text>

                    <SectionCard
                        title={`Заказов оплачено в этом ${isMonthActive ? 'месяце' : 'году'}`}
                        style={StyleSheet.flatten([
                            styles.statsCard,
                            { marginBottom: 0 },
                        ])}
                    >
                        <Text style={styles.bigText} numberOfLines={1}>
                            {paidOrdersCount.toLocaleString('ru-RU')}
                        </Text>
                    </SectionCard>

                    <SectionCard
                        title="Самый крупный заказ"
                        style={StyleSheet.flatten([
                            styles.statsCard,
                            { marginBottom: 0 },
                        ])}
                    >
                        <Pressable
                            style={styles.textBox}
                            onPress={() =>
                                largestOrder &&
                                navigation.navigate('OrderInfo', {
                                    orderId: largestOrder?.id,
                                })
                            }
                        >
                            {largestOrder ? (
                                <Text style={styles.bigText} numberOfLines={1}>
                                    {largestOrder.totalPrice.toLocaleString('ru-RU')} ₽
                                </Text>
                            ) : (
                                <Text style={[styles.emptyText, { paddingTop: 7 }]}>
                                    Заказов пока нет
                                </Text>
                            )}

                            {largestOrder && (
                                <Icon
                                    name="open-link-icon"
                                    size={20}
                                    style={styles.icon}
                                    color={colors.textMuted}
                                />
                            )}
                        </Pressable>
                    </SectionCard>
                </View>
            </ScrollView>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            marginTop: 7,
        },
        statsCard: {
            marginBottom: 15,
        },
        bigText: {
            fontFamily: 'Epilogue-SemiBold',
            color: theme.colors.text,
            fontSize: 24,
            flex: 1,
        },

        box: {
            marginTop: 25,
            rowGap: 15,
        },
        boxTitle: {
            fontFamily: 'Epilogue-SemiBold',
            color: theme.colors.text,
            fontSize: 20,
            marginLeft: 2,
        },

        lastPayments: {
            borderRadius: 25,
        },
        emptyBox: {
            backgroundColor: theme.colors.surface,
            borderRadius: 25,
            padding: 20,
        },
        emptyText: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.textMuted,
            textAlign: 'center',
            fontSize: 14,
        },

        textBox: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        icon: {
            marginHorizontal: 10,
        },
    }),
)
