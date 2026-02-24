import { ReactNode } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    value: string
    onChangeText: (v: string) => void
    placeholder: string
    left?: ReactNode
    right?: ReactNode
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    secureTextEntry?: boolean
}

export default function AuthInput(props: Props) {
    const styles = useStyles()

    return (
        <View style={styles.root}>
            {props.left ? <View style={styles.side}>{props.left}</View> : null}

            <TextInput
                value={props.value}
                keyboardType="default"
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                placeholderTextColor={styles.placeholder.color}
                autoCapitalize={props.autoCapitalize ?? 'none'}
                secureTextEntry={props.secureTextEntry}
                style={styles.input}
                textContentType="none"
                inputAccessoryViewID="no-keyboard"
            />

            {props.right ? <View style={styles.side}>{props.right}</View> : null}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        root: {
            height: 46,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: theme.colors.surface,
        },
        side: {
            opacity: 0.7,
        },
        input: {
            flex: 1,
            fontSize: 15,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
            paddingVertical: 0,
        },
        placeholder: {
            color: theme.colors.textMuted,
        },
    }),
)
