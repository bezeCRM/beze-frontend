import { useCallback, useMemo } from 'react'
import { useModalStore } from '@/modules/modal'
import type { ListSelectItem } from '@/modules/modal/variants/list-select-modal'
import type { Filling, Product } from '@/shared/types/types'

type Args = {
    products: Product[]
    getProductById: (id: string) => Product | undefined
    addItem: (product: Product, filling?: Filling) => void
}

export function useOrderProductPicker({ products, getProductById, addItem }: Args) {
    const { open } = useModalStore()

    const listItems: ListSelectItem[] = useMemo(() => {
        return (products ?? []).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.photoes?.[0]?.uri ?? null,
            next: (p.fillings?.length ?? 0) > 0,
        }))
    }, [products])

    const openPickFilling = useCallback(
        (product: Product, selectedId: string, onBack: () => void) => {
            const fillings: Filling[] = product.fillings ?? []

            open('chip-select', {
                title: 'Добавление товара',
                options: fillings.map(f => ({
                    id: f.id,
                    name: f.name,
                    selected: f.id === selectedId,
                })),
                onBack,
                onToggle: (id: string) => openPickFilling(product, id, onBack),
                onSubmit: () => {
                    const filling = fillings.find(f => f.id === selectedId)
                    addItem(product, filling)
                    open('status', {
                        title: 'Добавление товара',
                        message: 'Товар успешно добавлен!',
                        success: true,
                    })
                },
            })
        },
        [open, addItem],
    )

    const openPickProduct = useCallback(() => {
        open('list-select', {
            title: 'Добавление товара',
            items: listItems,
            primaryTitle: 'Добавить в заказ',
            searchPlaceholder: 'Поиск товаров по названию',
            closeOnSelect: false,
            onSelect: (it: ListSelectItem) => {
                const product = getProductById(it.id)
                if (!product) return

                const fillings = product.fillings ?? []
                if (fillings.length === 0) {
                    addItem(product)
                    open('status', {
                        title: 'Добавление товара',
                        message: 'Товар успешно добавлен!',
                        success: true,
                    })
                    return
                }

                openPickFilling(product, fillings[0].id, openPickProduct)
            },
        })
    }, [open, listItems, getProductById, addItem, openPickFilling])

    return { openPickProduct }
}
