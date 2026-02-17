import { Nav } from '@/core/navigation/types'
import { InternalHeaderTopBar } from '@/shared/components/headers/internal-header'
import { ModeSwitch } from '@/shared/components/mode-switch/mode-switch'
import Title from '@/shared/ui/title'
import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

type Mode = 'month' | 'year'

type Props = {
    monthActive: boolean
    onMonthPress: () => void
    onYearPress: () => void
}

export default function FinancesHeader({
    monthActive,
    onMonthPress,
    onYearPress,
}: Props) {
    const value: Mode = monthActive ? 'month' : 'year'

    const switchItems = useMemo(
        () => [
            { key: 'month' as Mode, label: 'месяц' },
            { key: 'year' as Mode, label: 'год' },
        ],
        [],
    )

    const navigation = useNavigation<Nav>()

    return (
        <View>
            <InternalHeaderTopBar onBack={() => navigation.goBack()} />
            <View style={styles.row}>
                <Title text="Финансы" />
                <ModeSwitch<Mode>
                    items={switchItems}
                    value={value}
                    onChange={(next: string) => {
                        if (next === 'month') onMonthPress()
                        else onYearPress()
                    }}
                    height={35}
                    radius={15}
                    inset={3}
                    itemGap={0}
                    contentPaddingX={12}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 9,
    },
})
