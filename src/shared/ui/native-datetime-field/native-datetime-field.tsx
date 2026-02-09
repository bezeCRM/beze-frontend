import DateTimePicker from '@react-native-community/datetimepicker'
import { useMemo, useState } from 'react'
import {
    DimensionValue,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

type Mode = 'date' | 'time'
type Variant = 'default' | 'ghost'

type Props = {
    mode: Mode
    value?: string | null // date: yyyy-mm-dd, time: hh:mm
    placeholder: string
    onChange: (next: string) => void
    minDate?: Date
    maxDate?: Date
    width?: DimensionValue

    displayValue?: string
    variant?: Variant
    containerStyle?: ViewStyle
    fieldStyle?: ViewStyle
    textStyle?: TextStyle
}

function pad2(n: number) {
    return String(n).padStart(2, '0')
}

function toDateValue(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function toTimeValue(d: Date) {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function parseValue(mode: Mode, value?: string | null) {
    const now = new Date()
    if (!value) return now

    if (mode === 'date') {
        const [y, m, dd] = value.split('-').map(Number)
        const d = new Date(now)
        d.setFullYear(y)
        d.setMonth((m || 1) - 1)
        d.setDate(dd || 1)
        d.setHours(12, 0, 0, 0)
        return d
    }

    const [hh, mm] = value.split(':').map(Number)
    const d = new Date(now)
    d.setHours(hh || 0, mm || 0, 0, 0)
    return d
}

function formatDisplay(mode: Mode, value?: string | null) {
    if (!value) return ''
    if (mode === 'time') return value

    const [y, m, d] = value.split('-')
    if (!y || !m || !d) return ''
    return `${d}.${m}.${y.slice(2)}`
}

export default function NativeDateTimeField({
    mode,
    value,
    placeholder,
    onChange,
    minDate,
    maxDate,
    width,

    displayValue,
    variant = 'default',
    containerStyle,
    fieldStyle,
    textStyle,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const [visible, setVisible] = useState(false)
    const [temp, setTemp] = useState<Date>(() => parseValue(mode, value))

    const pickerValue = useMemo(() => parseValue(mode, value), [mode, value])

    const open = () => {
        setTemp(pickerValue)
        setVisible(true)
    }

    const close = () => setVisible(false)

    const commit = (d: Date) => {
        if (mode === 'date') onChange(toDateValue(d))
        else onChange(toTimeValue(d))
    }

    const shownText = displayValue ?? (value ? formatDisplay(mode, value) : placeholder)
    const isPlaceholder = !displayValue && !value

    const fieldCombinedStyle = [
        styles.field,
        variant === 'ghost' && styles.fieldGhost,
        fieldStyle,
    ]

    const textCombinedStyle = [
        styles.value,
        variant === 'ghost' && styles.valueGhost,
        textStyle,
        isPlaceholder && { color: colors.textMuted },
    ]

    const wrapCombinedStyle = [
        styles.wrap,
        containerStyle,
        width != null ? { width } : null,
    ]

    if (Platform.OS === 'android') {
        return (
            <View style={wrapCombinedStyle}>
                <Pressable style={fieldCombinedStyle} onPress={open}>
                    <Text style={textCombinedStyle} allowFontScaling={false}>
                        {shownText}
                    </Text>
                </Pressable>

                {visible && (
                    <DateTimePicker
                        value={pickerValue}
                        mode={mode}
                        display="default"
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        onChange={(_, selected) => {
                            setVisible(false)
                            if (selected) commit(selected)
                        }}
                    />
                )}
            </View>
        )
    }

    return (
        <View style={wrapCombinedStyle}>
            <Pressable style={fieldCombinedStyle} onPress={open}>
                <Text style={textCombinedStyle}>{shownText}</Text>
            </Pressable>

            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.backdrop} onPress={close} />
                <View style={styles.iosSheet}>
                    <View style={styles.iosTop}>
                        <Pressable onPress={close} style={styles.iosBtn}>
                            <Text style={styles.iosBtnText}>Отмена</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                commit(temp)
                                close()
                            }}
                            style={styles.iosBtn}
                        >
                            <Text style={styles.iosBtnText}>Готово</Text>
                        </Pressable>
                    </View>

                    <DateTimePicker
                        value={temp}
                        mode={mode}
                        display="spinner"
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        onChange={(_, selected) => {
                            if (selected) setTemp(selected)
                        }}
                        style={styles.iosPicker}
                    />
                </View>
            </Modal>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {
            alignSelf: 'stretch',
            flexGrow: 1,
        },
        field: {
            alignSelf: 'stretch',
            flexGrow: 1,
            width: '100%',

            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 15,
            height: 50,
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        fieldGhost: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: 0,
            height: 50,
            justifyContent: 'center',

            alignSelf: 'stretch',
            flexGrow: 1,
            width: '100%',
        },
        value: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.text,
        },
        valueGhost: {
            fontSize: 14,
        },
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            width: '100%',
        },
        iosSheet: {
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingBottom: 10,
            width: '100%',
        },
        iosTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        iosBtn: {
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        iosBtnText: {
            color: theme.colors.info,
            fontFamily: 'Epilogue-Semibold',
            fontSize: 16,
        },
        iosPicker: {
            backgroundColor: theme.colors.background,
            width: '100%',
        },
    }),
)
