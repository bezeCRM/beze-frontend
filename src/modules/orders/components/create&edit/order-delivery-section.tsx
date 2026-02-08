import React from 'react'
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import NativeDateTimeField from '@/shared/ui/native-datetime-field/native-datetime-field'
import { isoToDotsShort } from '../../utils/order-format'

type Props = {
    isPickup: boolean
    address: string
    date: string
    time: string
    onTogglePickup: (v: boolean) => void
    onChangeAddress: (t: string) => void
    onChangeDate: (t: string) => void
    onChangeTime: (t: string) => void
    addressError?: boolean
    dateError?: boolean
    timeError?: boolean
}

export default function OrderDeliverySection({
    isPickup,
    address,
    date,
    time,
    onTogglePickup,
    onChangeAddress,
    onChangeDate,
    onChangeTime,
    addressError,
    dateError,
    timeError,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const addressDisabled = isPickup

    return (
        <SectionCard title="Доставка" required>
            <View style={styles.rowTop}>
                <Text style={styles.pickupLabel}>Самовывоз</Text>
                <Switch
                    value={isPickup}
                    onValueChange={onTogglePickup}
                    trackColor={{ false: colors.border, true: colors.brand }}
                    thumbColor={colors.fixedWhite}
                    ios_backgroundColor={colors.border}
                />
            </View>

            <TextInput
                value={address}
                onChangeText={onChangeAddress}
                placeholder="Адрес доставки"
                placeholderTextColor={colors.textMuted}
                editable={!addressDisabled}
                style={[
                    styles.input,
                    addressDisabled && styles.inputDisabled,
                    addressError && styles.inputError,
                ]}
                returnKeyType="done"
            />

            <View style={styles.dtRow}>
                <View style={styles.dtCol}>
                    <Text style={styles.dtLabel}>дата</Text>

                    <View
                        style={[
                            styles.input,
                            styles.dtField,
                            dateError && styles.inputError,
                        ]}
                    >
                        <NativeDateTimeField
                            mode="date"
                            value={date}
                            placeholder="ДД.MM.ГГ"
                            onChange={onChangeDate}
                            displayValue={date ? isoToDotsShort(date) : undefined}
                            width="100%"
                            variant="ghost"
                        />
                    </View>
                </View>

                <View style={styles.dtCol}>
                    <Text style={styles.dtLabel}>время</Text>

                    <View
                        style={[
                            styles.input,
                            styles.dtField,
                            timeError && styles.inputError,
                        ]}
                    >
                        <NativeDateTimeField
                            mode="time"
                            value={time}
                            placeholder="ЧЧ:MM"
                            onChange={onChangeTime}
                            width="100%"
                            variant="ghost"
                        />
                    </View>
                </View>
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        rowTop: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 15,
            marginBottom: 10,
        },
        pickupLabel: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        input: {
            backgroundColor: theme.colors.surface,
            height: 40,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        inputDisabled: {
            backgroundColor: theme.colors.border,
            borderColor: theme.colors.border,
            color: theme.colors.textMuted,
        },
        inputError: { borderColor: theme.colors.danger },

        dtRow: {
            flexDirection: 'row',
            columnGap: 20,
            marginTop: 15,
        },
        dtCol: {
            flex: 1,
        },
        dtLabel: {
            fontSize: 13,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
            marginBottom: 7,
            marginLeft: 2,
            textTransform: 'lowercase',
        },

        dtField: {
            justifyContent: 'center',
            paddingVertical: 0,
        },
    }),
)
