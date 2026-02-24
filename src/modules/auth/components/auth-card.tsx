import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    children: ReactNode
}

export default function AuthCard(props: Props) {
    const styles = useStyles()

    return <View style={styles.card}>{props.children}</View>
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            marginTop: 15,
            paddingHorizontal: 15,
            paddingVertical: 18,
            borderRadius: 25,
            width: '100%',
            backgroundColor: theme.colors.surface,
            rowGap: 10,

            shadowOpacity: 0.06,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
        },
    }),
)
