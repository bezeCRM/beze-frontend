import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'

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
    return (
        <View style={styles.row}>
            <Text style={styles.name}>{title}</Text>
            <View style={styles.right}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.input}
                    keyboardType="numeric"
                    returnKeyType="done"
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

const styles = StyleSheet.create({
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
        color: theme.colors.mainBlack,
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
        height: 34,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.mainWhite,
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    ruble: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
})
