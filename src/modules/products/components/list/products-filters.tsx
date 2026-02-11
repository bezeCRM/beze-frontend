import { useModalStore } from '@/modules/modal'
import Filters from '@/shared/components/filters'
import { useCategoryStore } from '../../store/categories.store'
import { Category } from '@/shared/types/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useToast } from '@/shared/components/toast/toast-provider'

const PRODUCTS_LIST_TOAST_SCOPE = 'productsList'

export default function ProductsFilters() {
    const { categories, activeCategoryId } = useCategoryStore()

    const { open, close } = useModalStore()
    const addCategory = useCategoryStore(s => s.addCategory)
    const setActiveCategory = useCategoryStore(s => s.setActiveCategory)
    const hasCategory = useCategoryStore(s => s.hasCategory)
    const removeCategory = useCategoryStore(s => s.removeCategory)

    const { showActionSheetWithOptions } = useActionSheet()
    const { show } = useToast()

    const openCategoryRemoveActions = (c: Category) => {
        const options = ['Удалить', 'Отмена']
        showActionSheetWithOptions(
            {
                title: 'Действия с категорией',
                options,
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
            },
            buttonIndex => {
                if (buttonIndex === 0 && c.id !== '__add__') {
                    removeCategory(c.id)
                    show(`Категория "${c.name}" удалена`, 'success', {
                        scope: PRODUCTS_LIST_TOAST_SCOPE,
                    })
                }
            },
        )
        return
    }

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
                close()
                show(`Категория "${name}" добавлена`, 'success', {
                    scope: PRODUCTS_LIST_TOAST_SCOPE,
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
            onRemoveCategory={openCategoryRemoveActions}
            showAllButton
            screenTitle="товары"
        />
    )
}
