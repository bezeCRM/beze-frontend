import { useMemo } from 'react'
import BaseModal from '@/modules/modal/base/base-modal'
import ListSelectModal, {
    type ListSelectItem,
} from '@/modules/modal/variants/list-select-modal'
import { useProductsStore } from '@/shared/store/products.store'

type Props = {
    visible: boolean
    onClose: () => void
    excludeProductId?: string
    onPickProduct: (productId: string) => void
}

export default function CopyIngredientsModal({
    visible,
    onClose,
    excludeProductId,
    onPickProduct,
}: Props) {
    const products = useProductsStore(s => s.products)

    const items: ListSelectItem[] = useMemo(() => {
        return (products ?? [])
            .filter(p => p.id !== excludeProductId)
            .map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.photoes?.[0]?.uri ?? null,
            }))
    }, [products, excludeProductId])

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <ListSelectModal
                title="Копирование ингредиентов"
                items={items}
                primaryTitle="Скопировать ингредиенты"
                searchPlaceholder="Поиск товаров по названию"
                onSelect={item => onPickProduct(item.id)}
                onClose={onClose}
            />
        </BaseModal>
    )
}
