import React from 'react'
import Filters from '@/shared/components/filters'
import { useCategoryStore } from '@/shared/store/categories'
import { Category } from '@/shared/types/types'

export default function ProductsFilters() {
    const { categories, activeCategoryId, setActiveCategory, addCategory } =
        useCategoryStore()

    const handleSelect = (item: Category) => {
        if (item.id === 'all') {
            setActiveCategory(null) // сбрасываем фильтр
        } else {
            setActiveCategory(item.id === activeCategoryId ? null : item.id)
        }
    }

    const handleAddCategory = () => {
        addCategory('Новая категория')
    }

    return (
        <Filters
            items={categories}
            activeId={activeCategoryId}
            onSelect={handleSelect}
            onAddCategory={handleAddCategory}
            showAllButton
        />
    )
}
