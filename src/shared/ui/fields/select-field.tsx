import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '@/shared/theme'
import SelectIcon from '@/assets/images/select-icon.svg'
import SectionCard from '../section/section-card'

type Props = { label: string; required?: boolean; value?: string; onPress: () => void; error?: boolean }

export default function SelectField({ label, required, value, onPress, error }: Props) {
  return (
    <SectionCard title={label}>
      <TouchableOpacity style={[styles.field, error && styles.fieldError]} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.value}>{value || ''}</Text>
        <SelectIcon width={14} height={8} />
      </TouchableOpacity>
    </SectionCard>
  )
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: theme.colors.mainWhite,
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    lineHeight: 16.8,
    borderWidth: 1,
    borderColor: theme.colors.lineGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldError: { borderColor: theme.colors.errorRed },
  value: { fontSize: 14, color: theme.colors.mainBlack, fontFamily: 'Epilogue-Regular' },
})
