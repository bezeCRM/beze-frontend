import React from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '@/shared/ui/button/button'
import { theme } from '@/shared/theme'

type Props = {
    primaryTitle?: string
    secondaryTitle?: string
    onPrimaryPress?: () => void
    onSecondaryPress?: () => void
    primaryDisabled?: boolean
    danger?: boolean
}

export default function ModalFooter({
    primaryTitle,
    secondaryTitle,
    onPrimaryPress,
    onSecondaryPress,
    primaryDisabled,
}: Props) {
    return (
        <View style={styles.container}>
            {secondaryTitle && (
                <Button
                    title={secondaryTitle}
                    onPress={onSecondaryPress}
                    small
                    style={styles.secondary}
                />
            )}
            {primaryTitle && (
                <Button
                    title={primaryTitle}
                    onPress={onPrimaryPress}
                    disabled={primaryDisabled}
                    modalWide
                />
            )}
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondary: {
        backgroundColor: colors.mainGray,
    },
})
