import { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'

type Item = { id: string; name: string; price?: number; image?: string }

export type ListSelectModalProps = BaseModalProps & {
    title: string
    items: Item[]
    onSelect: (item: any) => void
}

export default function ListSelectModal({
    title,
    items,
    onSelect,
    onClose,
}: ListSelectModalProps) {
    const [query, setQuery] = useState('')

    const filtered = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <TextInput
                placeholder="Поиск товаров по названию"
                value={query}
                onChangeText={setQuery}
                style={styles.search}
                placeholderTextColor={theme.colors.mainGray}
            />

            <FlatList
                data={filtered}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => onSelect(item)}
                        activeOpacity={0.7}
                    >
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.thumb} />
                        ) : (
                            <View style={[styles.thumb, styles.thumbPlaceholder]} />
                        )}
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            {item.price && (
                                <Text style={styles.price}>{item.price} ₽</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                style={{ maxHeight: 240 }}
            />

            <ModalFooter
                primaryTitle="Скопировать рецепт товара"
                onPrimaryPress={onClose}
            />
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingBottom: 10 },
    search: {
        backgroundColor: colors.mainWhite,
        borderColor: colors.lineGray,
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        fontSize: 14,
        color: colors.mainBlack,
        marginBottom: 10,
    },
    item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
    thumb: { width: 40, height: 40, borderRadius: 8 },
    thumbPlaceholder: { backgroundColor: colors.mainGray },
    name: { fontSize: 14, color: colors.mainBlack },
    price: { fontSize: 13, color: colors.mainGray },
})
