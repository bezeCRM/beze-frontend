import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import Button from '@/shared/ui/button/button'
import DeleteItemIcon from '@/assets/images/delete_item-icon.svg'
import CopyIcon from '@/assets/images/copy-ingredients-icon.svg'
import { theme } from '@/shared/theme'
import { Ingredient } from '@/shared/types/types'

type Props = {
  ingredients: Ingredient[]
  onChangeName?: (id: string, text: string) => void
  onChangeAmount?: (id: string, text: string) => void
  onAddPress?: () => void
  onRemovePress?: (id: string) => void
  onCopyPress?: () => void
}

export default function IngredientsEditor({
  ingredients,
  onChangeName,
  onChangeAmount,
  onAddPress,
  onRemovePress,
  onCopyPress,
}: Props) {
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
        {ingredients.map((ing) => (
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
              onChangeText={(t) => onChangeName?.(ing.id, t)}
              placeholder="Название"
              placeholderTextColor={theme.colors.mainGray}
              style={styles.inputName}
              returnKeyType="done"
            />

            <TextInput
              value={ing.weightGrams ?? ''}
              onChangeText={(t) => onChangeAmount?.(ing.id, t)}
              placeholder="Вес, г"
              placeholderTextColor={theme.colors.mainGray}
              style={styles.inputAmount}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        ))}

        <Button title="Добавить ингредиент" onPress={onAddPress} small blue />
      </View>
    </SectionCard>
  )
}

const { colors } = theme

const styles = StyleSheet.create({
  copyBtn: { position: 'absolute', right: 16, top: 16 },

  list: { gap: 10 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteBtn: {
    width: 28,
    height: 40,
    alignItems: 'center',
    marginRight: 8,
  },

  // имя занимает всё оставшееся место
  inputName: {
    flex: 1,
    minWidth: 120, // не схлопывается на совсем узких экранах
    backgroundColor: colors.mainWhite,
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.lineGray,
    fontSize: 16,
    fontFamily: 'Epilogue-Regular',
    color: colors.mainBlack,
    marginRight: 10, // запасной отступ, если gap где-то не сработает
  },

  // «вес, г» занимает долю контейнера + пороги
  inputAmount: {
    width: '32%',
    minWidth: 88, 
    maxWidth: 150, 
    textAlign: 'center',
    backgroundColor: colors.mainWhite,
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.lineGray,
    fontSize: 16,
    fontFamily: 'Epilogue-Regular',
    color: colors.mainBlack,
  },
})