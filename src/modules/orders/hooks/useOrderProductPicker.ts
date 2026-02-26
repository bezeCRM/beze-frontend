import { useCallback, useMemo } from 'react'
import { useModalStore } from '@/modules/modal'
import type { ListSelectItem } from '@/modules/modal/variants/list-select-modal'
import type { Filling, Product } from '@/shared/types/types'
import { useToast } from '@/shared/components/toast/toast-provider'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'

type Args = {
    products: Product[]
    getProductById: (id: string) => Product | undefined
    addItem: (product: Product, filling?: Filling) => void
    toastScope?: string
}

export function useOrderProductPicker({
    products,
    getProductById,
    addItem,
    toastScope,
}: Args) {
    const { open, close } = useModalStore()
    const { show } = useToast()

    const scope = toastScope ?? TOAST_SCOPES.OrderCreate

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

                    try {
                        addItem(product, filling)
                        close()
                        show('Товар добавлен', 'success', { scope })
                    } catch (e) {
                        console.log('addItem failed (filling modal)', e)
                        show('Не удалось добавить товар', 'error', { scope })
                    }
                },
            })
        },
        [open, addItem, close, show, scope],
    )

    const openPickProduct = useCallback(() => {
        const itemsCount = listItems.length
        if (itemsCount === 0) {
            console.log('product picker opened with empty listItems')
            show('Список товаров пуст. Синхронизируй каталог и попробуй снова', 'error', {
                scope,
            })
        }

        open('list-select', {
            title: 'Добавление товара',
            items: listItems,
            primaryTitle: 'Добавить в заказ',
            searchPlaceholder: 'Поиск товаров по названию',
            closeOnSelect: false,
            onSelect: (it: ListSelectItem) => {
                const byStore = getProductById(it.id)
                const byList = (products ?? []).find(p => p.id === it.id)

                if (!byStore && !byList) {
                    console.log('product not found on select', {
                        selectedId: it.id,
                        listItemsCount: listItems.length,
                        productsCount: products?.length ?? 0,
                    })
                    show(
                        'Товар не найден в каталоге. Синхронизируй товары и попробуй снова',
                        'error',
                        { scope },
                    )
                    return
                }

                if (!byStore && byList) {
                    console.log(
                        'getProductById returned undefined, fallback to products[]',
                        {
                            selectedId: it.id,
                        },
                    )
                }

                const product = byStore ?? byList!
                const fillings = product.fillings ?? []

                if (fillings.length === 0) {
                    try {
                        addItem(product)
                        close()
                        show('Товар добавлен', 'success', { scope })
                    } catch (e) {
                        console.log('addItem failed (no fillings)', e)
                        show('Не удалось добавить товар', 'error', { scope })
                    }
                    return
                }

                const firstFillingId = fillings[0]?.id
                if (!firstFillingId) {
                    console.log('fillings array is non-empty but first id is missing', {
                        productId: product.id,
                        fillings,
                    })
                    show(
                        'У товара некорректные начинки. Проверь товар в каталоге',
                        'error',
                        {
                            scope,
                        },
                    )
                    return
                }

                openPickFilling(product, firstFillingId, openPickProduct)
            },
        })
    }, [
        open,
        listItems,
        products,
        getProductById,
        openPickFilling,
        addItem,
        close,
        show,
        scope,
    ])

    return { openPickProduct }
}
