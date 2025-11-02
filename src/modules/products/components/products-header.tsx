import { View, StyleSheet } from 'react-native'
import Title from '@/shared/ui/title'
import AddProductButton from '@/shared/ui/add-plus'

export default function ProductsHeader() {
    return (
        <View style={styles.row}>
            <Title text="Товары" />
            <AddProductButton />
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
