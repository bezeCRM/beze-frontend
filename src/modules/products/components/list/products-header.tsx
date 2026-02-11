import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import AddPlus from '@/shared/ui/add-plus'
import { useNavigation } from '@react-navigation/native'
import { Nav } from '@/core/navigation/types'

export default function ProductsHeader() {
    const navigation = useNavigation<Nav>()

    return (
        <View style={styles.row}>
            <Title text="Товары" />
            <AddPlus onPress={() => navigation.navigate('ProductCreate')} />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 7,
        marginBottom: 10,
    },
})
