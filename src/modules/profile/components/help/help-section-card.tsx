import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Icon, IconName } from '@/shared/ui/icon/icon'
import { View, StyleSheet, Text } from 'react-native'

type Props = {
    title: string
    icon: IconName
    text: string
    pinkBackground?: boolean
}

export function HelpSectionCard({ title, icon, text, pinkBackground }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    return (
        <View style={[styles.box, pinkBackground && styles.pinkBackgroundBox]}>
            <View style={styles.titleBox}>
                <Icon
                    name={icon}
                    height={20}
                    color={pinkBackground ? colors.fixedWhite : colors.brand}
                />
                <Text
                    selectable
                    style={[
                        styles.titleText,
                        pinkBackground && styles.pinkBackgroundTitle,
                    ]}
                >
                    {title}
                </Text>
            </View>

            <Text
                selectable
                style={[
                    styles.textContent,
                    pinkBackground && styles.pinkBackgroundTextContent,
                ]}
            >
                {text}
            </Text>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        box: {
            backgroundColor: theme.colors.surface,
            borderRadius: 25,
            paddingVertical: 20,
            paddingHorizontal: 18,
            rowGap: 12,
        },
        pinkBackgroundBox: {
            backgroundColor: theme.colors.brand,
        },

        titleBox: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
        },
        titleText: {
            fontFamily: 'Epilogue-SemiBold',
            color: theme.colors.text,
            fontSize: 18,
        },
        pinkBackgroundTitle: {
            color: theme.colors.fixedWhite,
        },
        textContent: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
            fontSize: 14,
            lineHeight: 16.8,
        },
        pinkBackgroundTextContent: {
            color: theme.colors.fixedWhite,
        },
    }),
)
