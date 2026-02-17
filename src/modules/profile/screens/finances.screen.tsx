import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ScreenContainer from '@/shared/components/layout/screen-container'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import FinancesHeader from '../components/finances/finances-header'

import { useOrdersStore } from '@/modules/orders/store/orders.store'
import {
    calcAverageCheck,
    calcExpectedRest,
    calcReceivedRevenue,
    FinancePeriod,
} from '../utils/revenue'

export default function FinancesScreen() {
    const { bottom } = useSafeAreaInsets()
    const styles = useStyles()
    const [isMonthActive, setIsMonthActive] = useState(true)
    // const [scrollEnabled, setScrollEnabled] = useState(true)

    const orders = useOrdersStore(s => s.orders)

    const period: FinancePeriod = isMonthActive ? 'month' : 'year'

    const revenue = useMemo(() => calcReceivedRevenue(orders, period), [orders, period])
    const expected = useMemo(() => calcExpectedRest(orders, period), [orders, period])
    const avgCheck = useMemo(() => calcAverageCheck(orders, period), [orders, period])

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
                // scrollEnabled={scrollEnabled}
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

                <SectionCard title={`Средний чек заказа`} style={styles.statsCard}>
                    <Text style={styles.bigText} numberOfLines={1}>
                        {avgCheck.toLocaleString('ru-RU')} ₽
                    </Text>
                </SectionCard>
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
    }),
)
