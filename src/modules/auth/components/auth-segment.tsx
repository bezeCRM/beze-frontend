import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

export type AuthSegmentValue = 'login' | 'register'

type Props = {
    value: AuthSegmentValue
    onChange: (v: AuthSegmentValue) => void
}

export default function AuthSegment(props: Props) {
    const styles = useStyles()

    const item = (label: string, value: AuthSegmentValue) => {
        const active = props.value === value

        return (
            <Pressable
                onPress={() => props.onChange(value)}
                style={[styles.item, active ? styles.itemActive : styles.itemInactive]}
            >
                <Text style={styles.itemText}>{label}</Text>
            </Pressable>
        )
    }

    return (
        <View style={styles.root}>
            {item('Вход', 'login')}
            {item('Регистрация', 'register')}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        root: {
            flexDirection: 'row',
            marginTop: 30,
            gap: 10,
            alignSelf: 'center',
        },
        item: {
            paddingHorizontal: 20,
            height: 40,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            backgroundColor: theme.colors.surface,
        },
        itemActive: {
            borderColor: theme.colors.brand,
        },
        itemInactive: {
            borderColor: theme.colors.border,
        },
        itemText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
        },
    }),
)
