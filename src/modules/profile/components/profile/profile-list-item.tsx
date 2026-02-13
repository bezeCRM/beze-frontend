import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Icon, IconName } from '@/shared/ui/icon/icon'
import { View, StyleSheet, Text, Pressable } from 'react-native'

type Props = {
    icon: IconName
    title: string
    arrow: boolean
    nav?: () => void
}

export default function ProfileUserInfo({ icon, title, arrow, nav }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    return (
        <Pressable style={styles.box} onPress={nav}>
            <Icon name={icon}></Icon>
            <Text style={styles.text} numberOfLines={1}>
                {title}
            </Text>
            {arrow && (
                <View style={styles.arrowBox}>
                    <Icon
                        name="arrow-icon"
                        rotateDeg={180}
                        height={15}
                        color={colors.brand}
                    />
                </View>
            )}
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        box: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
        },
        text: {
            marginLeft: 15,
            flex: 1,
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.text,
        },
        arrowBox: {
            marginLeft: 5,
        },
    }),
)
