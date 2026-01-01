import React from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import Button from '@/shared/ui/button/button'
import DeleteItemIcon from '@/assets/images/delete_item-icon.svg'
import { theme } from '@/shared/theme'
import { Filling } from '@/shared/types/types'

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
                            <DeleteItemIcon width={20} height={20} />
                        </TouchableOpacity>

                        <TextInput
                            value={filling.name ?? ''}
                            onChangeText={t => onChangeName?.(filling.id, t)}
                            placeholder="Начинка"
                            placeholderTextColor={theme.colors.mainGray}
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

const { colors } = theme

const styles = StyleSheet.create({
    list: { gap: 10 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    deleteBtn: { width: 30, alignItems: 'center' },
    input: {
        flex: 1,
        backgroundColor: colors.mainWhite,
        borderRadius: 15,
        height: 40,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.lineGray,
        fontSize: 14,
        fontFamily: 'Epilogue-Regular',
        color: colors.mainBlack,
    },
})
