import { Pressable, StyleSheet, Text } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    title: string
    onPress: () => void
}

export default function AuthLink(props: Props) {
    const styles = useStyles()

    return (
        <Pressable onPress={props.onPress} style={styles.root}>
            <Text style={styles.text}>{props.title}</Text>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        root: {
            alignSelf: 'center',
            paddingBottom: 5,
        },
        text: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.brand,
        },
    }),
)
