import { View, TextInput, StyleSheet, TextInputProps } from 'react-native'
import SearchIcon from '@/assets/images/search.svg'
import { theme } from '@/shared/theme'

type Props = {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    editable?: boolean
    onSubmit?: () => void
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'editable'>

export default function Search({
    value,
    onChangeText,
    placeholder = 'Поиск по названию',
    editable = true,
    onSubmit,
    ...rest
}: Props) {
    return (
        <View style={styles.container}>
            <SearchIcon width={16} height={16} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.mainGray}
                editable={editable}
                returnKeyType="search"
                onSubmitEditing={onSubmit}
                {...rest}
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
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 14,
        paddingTop: 2,
        fontFamily: 'Epilogue-Regular',
        color: theme.colors.mainBlack,
    },
})
