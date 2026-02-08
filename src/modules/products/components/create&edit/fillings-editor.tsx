import React from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import Button from '@/shared/ui/button/button'
import { Filling } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Icon } from '@/shared/ui/icon/icon'

type Props = {
    fillings: Filling[]
    onChangeName?: (id: string, text: string) => void
    onAddPress?: () => void
    onRemovePress?: (id: string) => void
}

export default function FillingsEditor({
    fillings,
    onChangeName,
    onAddPress,
    onRemovePress,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    return (
        <SectionCard title="Начинки">
            <View style={styles.list}>
                {fillings.map(filling => (
                    <View key={filling.id} style={styles.row}>
                        <TouchableOpacity
                            onPress={() => onRemovePress?.(filling.id)}
                            style={styles.deleteBtn}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <Icon name="delete_item-icon" size={20} rotateDeg={0} />
                        </TouchableOpacity>

                        <TextInput
                            value={filling.name ?? ''}
                            onChangeText={t => onChangeName?.(filling.id, t)}
                            placeholder="Начинка"
                            placeholderTextColor={colors.textMuted}
                            style={styles.input}
                            returnKeyType="done"
                        />
                    </View>
                ))}

                <Button title="Добавить начинку" onPress={onAddPress} small blue />
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        list: { gap: 10 },
        row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
        deleteBtn: { width: 30, alignItems: 'center' },
        input: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            height: 40,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
        },
    }),
)
