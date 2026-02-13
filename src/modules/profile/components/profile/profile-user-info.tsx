import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { View, StyleSheet, Image, Text } from 'react-native'

type Props = {
    image?: string | null
    name?: string | null
    nick?: string | null
}

export default function ProfileUserInfo({ image, name, nick }: Props) {
    const styles = useStyles()
    return (
        <View style={styles.row}>
            <Image
                source={
                    image
                        ? { uri: image }
                        : require('@/assets/images/avatar-placeholder.png')
                }
                style={{ width: 80, height: 80 }}
                resizeMode="cover"
            />
            <View style={styles.textBox}>
                <Text numberOfLines={1} style={styles.name}>
                    {name || 'User'}
                </Text>

                <Text numberOfLines={1} style={styles.nick}>
                    {nick ? `@${nick}` : '@nickname'}
                </Text>
            </View>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 15,
            marginBottom: 20,
        },
        textBox: {
            flex: 1,
            rowGap: 5,
            overflow: 'hidden',
        },
        name: {
            flexShrink: 1,
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 20,
            color: theme.colors.text,
        },
        nick: {
            flexShrink: 1,
            fontFamily: 'Epilogue-Regular',
            fontSize: 18,
            color: theme.colors.textMuted,
        },
    }),
)
