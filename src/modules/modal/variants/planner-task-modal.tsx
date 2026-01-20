import { useMemo, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import NativeDateTimeField from '@/shared/ui/native-datetime-field/native-datetime-field'

export type PlannerTaskModalProps = BaseModalProps & {
    initialDate: string
    onSubmit: (payload: { title: string; date: string; time?: string }) => void
}

export default function PlannerTaskModal({
    initialDate,
    onSubmit,
    onClose,
}: PlannerTaskModalProps) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const [title, setTitle] = useState('')
    const [date, setDate] = useState(initialDate)
    const [time, setTime] = useState<string | null>(null)

    const trimmed = title.trim()
    const primaryDisabled = useMemo(() => trimmed.length === 0 || !date, [trimmed, date])

    const handleSubmit = () => {
        if (primaryDisabled) return
        onSubmit({ title: trimmed, date, time: time || undefined })
    }

    return (
        <View style={styles.container}>
            <ModalHeader title="Добавление задачи" onClose={onClose} />

            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Введите название"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
            />

            <View style={styles.row}>
                <View style={styles.field}>
                    <NativeDateTimeField
                        mode="date"
                        value={date}
                        placeholder="XX.XX.XX"
                        onChange={setDate}
                        width="100%"
                    />
                </View>

                <View style={styles.field}>
                    <NativeDateTimeField
                        mode="time"
                        value={time}
                        placeholder="XX:XX"
                        onChange={setTime}
                        width="100%"
                    />
                </View>
            </View>

            <ModalFooter
                primaryTitle="Добавить задачу"
                onPrimaryPress={handleSubmit}
                primaryDisabled={primaryDisabled}
            />
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {},
        input: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 15,
            height: 45,
            fontFamily: 'Epilogue-Regular',
            marginBottom: 14,
            marginHorizontal: 15,
            fontSize: 16,
            color: theme.colors.text,
        },
        row: {
            flexDirection: 'row',
            gap: 12,
            marginHorizontal: 15,
            marginBottom: 10,
        },
        field: { flex: 1 },
    }),
)
