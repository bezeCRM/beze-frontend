import LogoIcon from '@/assets/images/logo.svg'
import { useTheme } from '@/shared/theme/useTheme'
import { Icon } from '@/shared/ui/icon/icon'
import { StyleSheet, View } from 'react-native'

export default function AuthLogo() {
    const colors = useTheme().theme.colors

    return (
        <View style={styles.container}>
            <LogoIcon height={32} width={40} />
            <Icon name="logo-text-icon" color={colors.text} size={54} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // borderColor: '#FFFFFF',
        // borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 10,
        height: 42,
        width: 120,
        marginBottom: -10,
    },
})
