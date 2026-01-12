import type { ProductFormValues } from '../hooks/useProductFormBase'

const isNonEmpty = (v?: string) => (v ?? '').trim().length > 0

export function hasProductCreateMeaningfulValues(values?: ProductFormValues) {
    if (!values) return false

    if (isNonEmpty(values.name)) return true
    if (isNonEmpty(values.price)) return true
    if (values.unit !== 'piece') return true
    if (values.category) return true
    if (isNonEmpty(values.recipe)) return true

    if ((values.photoes ?? []).length > 0) return true

    const fillings = values.fillings ?? []
    if (fillings.some(f => isNonEmpty(f?.name))) return true

    const ingredients = values.ingredients ?? []
    if (ingredients.some(i => isNonEmpty(i?.name) || isNonEmpty(i?.weightGrams))) {
        return true
    }

    return false
}

export function mergeProductCreateDraft(
    base: ProductFormValues,
    draft: ProductFormValues,
): ProductFormValues {
    return {
        ...base,
        ...draft,
        fillings: draft.fillings ?? base.fillings,
        ingredients: draft.ingredients ?? base.ingredients,
        photoes: draft.photoes ?? base.photoes,
    }
}
