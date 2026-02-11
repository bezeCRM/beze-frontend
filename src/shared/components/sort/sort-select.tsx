import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { SortOption } from './types'
import { getOptionLabel } from './utils'

type Variant = 'default' | 'ghost'

type Props<Id extends string> = {
    value: Id
    options: SortOption<Id>[]
    onChange: (next: Id) => void
    title?: string
    cancelLabel?: string
    variant?: Variant
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    left?: React.ReactNode
}

export default function SortSelect<Id extends string>({
    value,
    options,
    onChange,
    title = 'Сортировка',
    cancelLabel = 'Отмена',
    variant = 'default',
    containerStyle,
    textStyle,
    left,
}: Props<Id>) {
    const styles = useStyles()
    const { showActionSheetWithOptions } = useActionSheet()

    const label = useMemo(
        () => getOptionLabel(options, value, title),
        [options, value, title],
    )

    const open = () => {
        const labels = options.map(o => (o.id === value ? `✓ ${o.label}` : o.label))
        const cancelButtonIndex = labels.length

        showActionSheetWithOptions(
            {
                title,
                options: [...labels, cancelLabel],
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex == null) return
                if (buttonIndex === cancelButtonIndex) return
                const next = options[buttonIndex]
                if (next) onChange(next.id)
            },
        )
    }

    const rootStyle = [
        styles.root,
        variant === 'ghost' && styles.rootGhost,
        containerStyle,
    ]

    const labelStyle = [styles.label, variant === 'ghost' && styles.labelGhost, textStyle]

    return (
        <Pressable style={rootStyle} onPress={open}>
            <View style={styles.row}>
                {left ? <View style={styles.left}>{left}</View> : null}
                <Text style={labelStyle} numberOfLines={1} allowFontScaling={false}>
                    {label}
                </Text>
            </View>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        root: {
            borderRadius: 999,
            paddingHorizontal: 14,
            height: 38,
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignSelf: 'flex-start',
        },
        rootGhost: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: 0,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
        },
        left: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        label: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
        },
        labelGhost: {
            fontSize: 14,
        },
    }),
)
