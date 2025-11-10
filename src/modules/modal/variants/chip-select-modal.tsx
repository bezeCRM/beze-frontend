import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'

type Option = { id: string; name: string; selected?: boolean }

export type ChipSelectModalProps = BaseModalProps & {
    title: string
    options: Option[]
    onToggle: (id: string) => void
    onSubmit: () => void
}
export default function ChipSelectModal({
    title,
    options,
    onToggle,
    onSubmit,
    onClose,
}: ChipSelectModalProps) {
    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <View style={styles.chips}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt.id}
                        style={[styles.chip, opt.selected && styles.chipSelected]}
                        onPress={() => onToggle(opt.id)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                opt.selected && styles.chipTextSelected,
                            ]}
                        >
                            {opt.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ModalFooter primaryTitle="Добавить в заказ" onPrimaryPress={onSubmit} />
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingBottom: 10 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
    chip: {
        backgroundColor: colors.mainGray,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    chipSelected: {
        backgroundColor: colors.mainPink,
    },
    chipText: {
        color: colors.mainBlack,
        fontSize: 14,
    },
    chipTextSelected: {
        color: colors.mainWhite,
    },
})
