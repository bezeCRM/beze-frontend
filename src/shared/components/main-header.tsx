import Logo from '@/assets/images/logo.svg'
import { StyleSheet, View } from 'react-native'

export default function MainHeader() {
    return (
        <View style={styles.container}>
            <Logo width={78} height={30} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginTop: -5,
    },
})
