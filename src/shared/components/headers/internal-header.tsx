import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Icon } from '@/shared/ui/icon/icon'

type CommonProps = {
    onBack?: () => void
    onActionPress?: () => void
    showAction?: boolean
    actionText?: string
}

export function InternalHeaderTopBar({
    onBack,
    onActionPress,
    showAction = false,
    actionText = 'Изменить',
}: CommonProps) {
    const colors = useTheme().theme.colors
    const styles = useStyles()
    return (
        <View style={styles.topBar}>
            <Pressable
                onPress={onBack}
                style={styles.backBtn}
                android_ripple={{ color: colors.brand }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Icon name="arrow-icon" height={21} color={colors.brand} />
                <Text style={styles.backText}>Назад</Text>
            </Pressable>

            {showAction ? (
                <Pressable
                    onPress={onActionPress}
                    style={styles.editBtn}
                    android_ripple={{ color: colors.brand }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={styles.editText}>{actionText}</Text>
                </Pressable>
            ) : (
                <View style={styles.editSpacer} />
            )}
        </View>
    )
}

export function InternalHeaderTitle({
    title,
    titleStyle,
}: {
    title: string
    titleStyle?: TextStyle
}) {
    const styles = useStyles()
    return <Text style={[styles.title, titleStyle]}>{title}</Text>
}

type FullProps = CommonProps & {
    title: string
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
}

/**
 * полный вариант на две строки, если где-то ещё понадобится
 */
export default function InternalHeader({
    title,
    onBack,
    onActionPress,
    showAction = false,
    actionText = 'Изменить',
    containerStyle,
    titleStyle,
}: FullProps) {
    const styles = useStyles()
    return (
        <View style={[styles.container, containerStyle]}>
            <InternalHeaderTopBar
                onBack={onBack}
                onActionPress={onActionPress}
                showAction={showAction}
                actionText={actionText}
            />
            <InternalHeaderTitle title={title} titleStyle={titleStyle} />
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {},
        topBar: {
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 7,
        },
        backBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        backText: {
            color: theme.colors.brand,
            fontSize: 16,
            fontFamily: 'Epilogue-Regular',
        },
        editBtn: {
            paddingHorizontal: 6,
            paddingVertical: 4,
        },
        editText: {
            color: theme.colors.brand,
            fontSize: 16,
            fontFamily: 'Epilogue-Regular',
        },
        editSpacer: {
            width: 70,
        },
        title: {
            color: theme.colors.text,
            fontSize: 28,
            fontFamily: 'Epilogue-SemiBold',
            lineHeight: 33.6,
            marginBottom: 25,
        },
    }),
)
