import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import type { BaseModalProps } from '@/modules/modal/types/base-modal-props'

type Option = { id: string; name: string; selected?: boolean }

export type ChipSelectModalProps = BaseModalProps & {
    title: string
    headline?: string
    options: Option[]
    onToggle: (id: string) => void
    onSubmit: () => void
    onBack?: () => void
}

export default function ChipSelectModal({
    title,
    headline = 'Выберите начинку',
    options,
    onToggle,
    onSubmit,
    onBack,
    onClose,
}: ChipSelectModalProps) {
    const primaryDisabled = useMemo(() => !options.some(o => o.selected), [options])

    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} onBack={onBack} />

            <View style={styles.top}>
                <Text style={styles.headline}>{headline}</Text>
            </View>

            <View style={styles.body}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.bodyContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.chips}>
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.chip, opt.selected && styles.chipSelected]}
                                onPress={() => onToggle(opt.id)}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.chipText}>{opt.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <ModalFooter
                primaryTitle="Добавить в заказ"
                onPrimaryPress={onSubmit}
                primaryDisabled={primaryDisabled}
            />
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },

    top: {
        paddingHorizontal: 15,
        justifyContent: 'center',
        marginTop: -5,
    },
    headline: {
        fontSize: 16,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
        textAlign: 'center',
        marginBottom: 15,
    },

    body: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    bodyContent: {
        alignItems: 'center',
    },

    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        justifyContent: 'center',
    },
    chip: {
        backgroundColor: colors.mainGray,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    chipSelected: {
        backgroundColor: colors.mainPink,
    },
    chipText: {
        color: colors.mainWhite,
        fontSize: 14,
        fontFamily: 'Epilogue-SemiBold',
    },
})
