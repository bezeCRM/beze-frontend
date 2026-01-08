import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { theme } from '@/shared/theme'

type Props = {
    value: boolean
    onChange: (v: boolean) => void
}

export default function OrderPlannerToggle({ value, onChange }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.text}>В планере</Text>
            <View style={{ transform: [{ scale: 0.95 }] }}>
                <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{
                        false: theme.colors.lineGray,
                        true: theme.colors.mainPink,
                    }}
                    thumbColor={theme.colors.mainWhite}
                    ios_backgroundColor={theme.colors.lineGray}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.mainWhite,
        borderRadius: 25,
        paddingRight: 15,
        paddingLeft: 18,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
})
