import CopyIcon from '@/assets/images/copy-ingredients-icon.svg'
import DeleteItemIcon from '@/assets/images/delete_item-icon.svg'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Ingredient } from '@/shared/types/types'
import Button from '@/shared/ui/button/button'
import SectionCard from '@/shared/ui/section/section-card'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
    ingredients: Ingredient[]
    onChangeName?: (id: string, text: string) => void
    onChangeAmount?: (id: string, text: string) => void
    onAddPress?: () => void
    onRemovePress?: (id: string) => void
    onCopyPress?: () => void
    errorsById?: Record<string, { name?: boolean; weightGrams?: boolean }>
}

export default function IngredientsEditor({
    ingredients,
    onChangeName,
    onChangeAmount,
    onAddPress,
    onRemovePress,
    onCopyPress,
    errorsById,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    return (
        <SectionCard title="Ингредиенты">
            <TouchableOpacity
                onPress={onCopyPress}
                style={styles.copyBtn}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
                <CopyIcon width={16} height={16} />
            </TouchableOpacity>

            <View style={styles.list}>
                {ingredients.map(ing => {
                    const rowErr = errorsById?.[ing.id]
                    return (
                        <View key={ing.id} style={styles.row}>
                            <TouchableOpacity
                                onPress={() => onRemovePress?.(ing.id)}
                                style={styles.deleteBtn}
                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            >
                                <DeleteItemIcon width={20} height={20} />
                            </TouchableOpacity>

                            <TextInput
                                value={ing.name ?? ''}
                                onChangeText={t => onChangeName?.(ing.id, t)}
                                placeholder="Название"
                                placeholderTextColor={colors.textMuted}
                                style={[
                                    styles.inputName,
                                    rowErr?.name && styles.inputError,
                                ]}
                                returnKeyType="done"
                            />

                            <TextInput
                                value={ing.weightGrams ?? ''}
                                onChangeText={t => onChangeAmount?.(ing.id, t)}
                                placeholder="Вес, г"
                                placeholderTextColor={colors.textMuted}
                                style={[
                                    styles.inputAmount,
                                    rowErr?.weightGrams && styles.inputError,
                                ]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </View>
                    )
                })}
                <Button title="Добавить ингредиент" onPress={onAddPress} small blue />
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        copyBtn: { position: 'absolute', right: 0, top: -27 },

        list: { gap: 10 },

        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        deleteBtn: {
            width: 30,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 2,
        },

        // имя занимает всё оставшееся место
        inputName: {
            flex: 1,
            minWidth: 120, // не схлопывается на совсем узких экранах
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            height: 40,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
            marginRight: 10,
        },

        inputAmount: {
            width: '32%',
            minWidth: 88,
            maxWidth: 150,
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            height: 40,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
        },
        inputError: { borderColor: theme.colors.danger },
    }),
)
