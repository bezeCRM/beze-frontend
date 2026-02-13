import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    delivery: string
    urgency: string
    other: string
    discount: string
    onChangeDelivery: (t: string) => void
    onChangeUrgency: (t: string) => void
    onChangeOther: (t: string) => void
    onChangeDiscount: (t: string) => void
}

function Row({
    title,
    value,
    onChangeText,
}: {
    title: string
    value: string
    onChangeText: (t: string) => void
}) {
    const styles = useStyles()

    const isZero = Number(value) === 0
    const inputValue = isZero ? '' : value

    return (
        <View style={styles.row}>
            <Text style={styles.name}>{title}</Text>
            <View style={styles.right}>
                <TextInput
                    value={inputValue}
                    onChangeText={onChangeText}
                    style={styles.input}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholder="0"
                />
                <Text style={styles.ruble}>₽</Text>
            </View>
        </View>
    )
}

export default function OrderExtraSection({
    delivery,
    urgency,
    other,
    discount,
    onChangeDelivery,
    onChangeUrgency,
    onChangeOther,
    onChangeDiscount,
}: Props) {
    const styles = useStyles()
    return (
        <SectionCard title="Дополнительно">
            <View style={styles.list}>
                <Row title="доставка" value={delivery} onChangeText={onChangeDelivery} />
                <Row title="срочность" value={urgency} onChangeText={onChangeUrgency} />
                <Row title="другое" value={other} onChangeText={onChangeOther} />
                <Row title="скидка" value={discount} onChangeText={onChangeDiscount} />
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        list: { gap: 10 },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: 12,
        },
        name: {
            flex: 1,
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
            textTransform: 'lowercase',
        },
        right: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
        },
        input: {
            width: 70,
            minHeight: 34,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            textAlign: 'center',
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
            paddingHorizontal: 8,
            paddingVertical: 6,
        },
        ruble: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
