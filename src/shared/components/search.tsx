import { View, TextInput, StyleSheet } from 'react-native'
import SearchIcon from '@/assets/images/search.svg'
import { theme } from '@/shared/theme'

export default function Search() {
    return (
        <View style={styles.container}>
            <SearchIcon width={18} height={18} />
            <TextInput
                style={styles.input}
                placeholder="Поиск по названию"
                placeholderTextColor={theme.colors.mainGray}
                editable={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.mainWhite,
        borderRadius: 99,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 12,
        borderColor: theme.colors.lineGray,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Epilogue-Regular',
        color: theme.colors.mainBlack,
    },
})
