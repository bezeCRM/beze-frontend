import { View, Pressable, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/shared/theme'
import { ProductUnit } from '@/shared/types/types'
import SectionCard from '../section/section-card'

type Props = {
  value: ProductUnit
  onChange?: (v: ProductUnit) => void
  style?: ViewStyle
  disabled?: boolean
}

export default function UnitField({ value, onChange, style, disabled }: Props) {
  const options: { label: string; value: ProductUnit }[] = [
    { label: 'Штука', value: 'piece' },
    { label: 'Килограмм', value: 'kg' },
  ]

  return (
    <SectionCard title='Единица измерения'>
        <View style={[styles.row, style]} accessibilityRole="radiogroup">
        {options.map((opt) => {
            const checked = value === opt.value
            return (
            <Pressable
                key={opt.value}
                style={styles.item}
                onPress={() => !disabled && onChange?.(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked, disabled }}
                android_ripple={{ color: theme.colors.mainPink }}
            >
                <View style={[styles.dot, checked && styles.dotActive]} />
                <Text style={[styles.text, checked && styles.textActive]}>{opt.label}</Text>
            </Pressable>
            )
        })}
        </View>
    </SectionCard>
  )
}

const { colors } = theme

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.mainPink,
    marginRight: 7,
  },
  dotActive: {
    backgroundColor: colors.mainPink,
  },
  text: {
    color: colors.mainBlack,
    fontSize: 14,
  },
  textActive: {
  },
})
