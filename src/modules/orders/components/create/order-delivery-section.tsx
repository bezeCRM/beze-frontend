import React, { useCallback } from 'react'
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'

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

function onlyDigits(text: string) {
    return (text ?? '').replace(/\D/g, '')
}

function formatDate(text: string) {
    const d = onlyDigits(text).slice(0, 6)
    const dd = d.slice(0, 2)
    const mm = d.slice(2, 4)
    const yy = d.slice(4, 6)

    let out = dd
    if (mm.length) out += `.${mm}`
    if (yy.length) out += `.${yy}`
    return out
}

function formatTime(text: string) {
    const d = onlyDigits(text).slice(0, 4)
    const hh = d.slice(0, 2)
    const mm = d.slice(2, 4)

    let out = hh
    if (mm.length) out += `:${mm}`
    return out
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function normalizeDate(text: string) {
    const d = onlyDigits(text)
    if (d.length !== 6) return formatDate(text)

    const day = clamp(Number(d.slice(0, 2)) || 0, 1, 31)
    const month = clamp(Number(d.slice(2, 4)) || 0, 1, 12)
    const yy = clamp(Number(d.slice(4, 6)) || 0, 0, 99)

    const ddStr = String(day).padStart(2, '0')
    const mmStr = String(month).padStart(2, '0')
    const yyStr = String(yy).padStart(2, '0')
    return `${ddStr}.${mmStr}.${yyStr}`
}

function normalizeTime(text: string) {
    const d = onlyDigits(text)
    if (d.length !== 4) return formatTime(text)

    const hh = clamp(Number(d.slice(0, 2)) || 0, 0, 23)
    const mm = clamp(Number(d.slice(2, 4)) || 0, 0, 59)

    const hhStr = String(hh).padStart(2, '0')
    const mmStr = String(mm).padStart(2, '0')
    return `${hhStr}:${mmStr}`
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
    const addressDisabled = isPickup

    const handleDateChange = useCallback(
        (t: string) => onChangeDate(formatDate(t)),
        [onChangeDate],
    )
    const handleTimeChange = useCallback(
        (t: string) => onChangeTime(formatTime(t)),
        [onChangeTime],
    )

    return (
        <SectionCard title="Доставка *">
            <View style={styles.rowTop}>
                <Text style={styles.pickupLabel}>Самовывоз</Text>
                <Switch
                    value={isPickup}
                    onValueChange={onTogglePickup}
                    trackColor={{
                        false: theme.colors.lineGray,
                        true: theme.colors.mainPink,
                    }}
                    thumbColor={theme.colors.mainWhite}
                    ios_backgroundColor={theme.colors.lineGray}
                />
            </View>

            <TextInput
                value={address}
                onChangeText={onChangeAddress}
                placeholder="Адрес доставки"
                placeholderTextColor={theme.colors.mainGray}
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
                    <TextInput
                        value={date}
                        onChangeText={handleDateChange}
                        onBlur={() => onChangeDate(normalizeDate(date))}
                        placeholder="DD.MM.YY"
                        placeholderTextColor={theme.colors.mainGray}
                        style={[
                            styles.input,
                            styles.dtInput,
                            dateError && styles.inputError,
                        ]}
                        keyboardType="number-pad"
                        maxLength={8}
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.dtCol}>
                    <Text style={styles.dtLabel}>время</Text>
                    <TextInput
                        value={time}
                        onChangeText={handleTimeChange}
                        onBlur={() => onChangeTime(normalizeTime(time))}
                        placeholder="HH:MM"
                        placeholderTextColor={theme.colors.mainGray}
                        style={[
                            styles.input,
                            styles.dtInput,
                            timeError && styles.inputError,
                        ]}
                        keyboardType="number-pad"
                        maxLength={5}
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </View>
            </View>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 20,
        marginBottom: 10,
    },
    pickupLabel: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    input: {
        backgroundColor: theme.colors.mainWhite,
        height: 40,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    inputDisabled: {
        backgroundColor: theme.colors.lineGray,
        borderColor: theme.colors.lineGray,
        color: theme.colors.mainGray,
    },
    inputError: { borderColor: theme.colors.errorRed },

    dtRow: {
        flexDirection: 'row',
        columnGap: 20,
        marginTop: 15,
    },
    dtCol: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
    dtLabel: {
        fontSize: 13,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        marginBottom: 6,
        marginLeft: 2,
        textTransform: 'lowercase',
    },
    dtInput: { textAlign: 'center' },
})
