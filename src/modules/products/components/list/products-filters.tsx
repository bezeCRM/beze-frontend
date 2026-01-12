import { useModalStore } from '@/modules/modal'
import Filters from '@/shared/components/filters'
import { useCategoryStore } from '../../store/categories.store'
import { Category } from '@/shared/types/types'
import React from 'react'

export default function ProductsFilters() {
    const { categories, activeCategoryId } = useCategoryStore()

    const { open } = useModalStore()
    const addCategory = useCategoryStore(s => s.addCategory)
    const setActiveCategory = useCategoryStore(s => s.setActiveCategory)
    const hasCategory = useCategoryStore(s => s.hasCategory)

    function openAddCategoryModal() {
        open('form', {
            title: 'Добавление категории',
            placeholder: 'Введите название',
            buttonTitle: 'Добавить категорию',
            validate: (name: string) =>
                hasCategory(name) ? 'Такая категория уже существует' : null,
            onSubmit: (name: string) => {
                const id = addCategory(name)
                setActiveCategory(id)
                open('status', {
                    title: 'Добавление категории',
                    message: 'Категория успешно добавлена!',
                    success: true,
                })
            },
        })
    }

    const handleSelect = (item: Category) => {
        if (item.id === 'all') {
            setActiveCategory(null)
        } else {
            setActiveCategory(item.id === activeCategoryId ? null : item.id)
        }
    }

    return (
        <Filters
            items={categories}
            activeId={activeCategoryId}
            onSelect={handleSelect}
            onAddCategory={openAddCategoryModal}
            showAllButton
            screenTitle="товары"
        />
    )
}
