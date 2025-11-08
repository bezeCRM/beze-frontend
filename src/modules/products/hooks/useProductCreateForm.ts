import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, ProductUnit, Filling, Ingredient } from '@/shared/types/types'

// локальный тип для единственного фото
export type Photo = { id: string; uri: string }

const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
})

const FormSchema = z
    .object({
        name: z.string().trim().min(1, 'обязательное поле'),
        // категория теперь опциональна
        category: CategorySchema.optional(),
        unit: z.enum(['piece', 'kg'] as const),
        price: z.string().trim().min(1, 'обязательное поле'),

        recipe: z.string().optional(),
        fillings: z.array(z.object({ id: z.string(), name: z.string() })).optional(),

        // разрешаем пустые строки, но если пользователь начал, то требуем оба поля
        ingredients: z
            .array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    weightGrams: z.string(),
                }),
            )
            .optional(),

        photoes: z
            .array(z.object({ id: z.string(), uri: z.string() }))
            .max(3, 'максимум 3 фото')
            .optional(),
    })
    .superRefine((data, ctx) => {
        // проверяем только частично заполненные ингредиенты
        const list = data.ingredients ?? []
        list.forEach((row, idx) => {
            const hasName = row.name.trim().length > 0
            const hasWeight = row.weightGrams.trim().length > 0
            if (hasName || hasWeight) {
                if (!hasName) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['ingredients', idx, 'name'],
                        message: 'укажите название',
                    })
                }
                if (!hasWeight) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['ingredients', idx, 'weightGrams'],
                        message: 'укажите вес',
                    })
                }
            }
        })
    })

export type ProductCreateFormValues = z.input<typeof FormSchema>

export function useProductCreateForm(defaultCategory?: Category) {
    // дефолтные значения
    const defaultValues: ProductCreateFormValues = useMemo(() => {
        const base = {
            name: '',
            unit: 'piece' as const,
            price: '',
            recipe: '',
            fillings: [{ id: String(Date.now()), name: '' }] as Filling[],
            ingredients: [
                { id: String(Date.now()), name: '', weightGrams: '' },
            ] as Ingredient[],
            photoes: [] as Photo[],
        }
        return defaultCategory ? { ...base, category: defaultCategory } : base
    }, [defaultCategory])

    const form = useForm<ProductCreateFormValues>({
        defaultValues,
        resolver: zodResolver(FormSchema),
        mode: 'onSubmit',
    })

    // сеттеры
    function setCategory(c?: Category | null) {
        // null приводим к undefined, чтобы поле реально стало "пустым"
        form.setValue('category', c ?? undefined, { shouldValidate: true })
    }
    function setUnit(u: ProductUnit) {
        form.setValue('unit', u, { shouldValidate: true })
    }

    // fillings
    function addFilling() {
        const id = String(Date.now())
        const list: Filling[] = form.getValues('fillings') ?? []
        form.setValue('fillings', [...list, { id, name: '' }])
    }
    function updateFillingName(id: string, name: string) {
        const list: Filling[] = form.getValues('fillings') ?? []
        form.setValue(
            'fillings',
            list.map(f => (f.id === id ? { ...f, name } : f)),
        )
    }
    function removeFilling(id: string) {
        const list: Filling[] = form.getValues('fillings') ?? []
        form.setValue(
            'fillings',
            list.filter(f => f.id !== id),
        )
    }

    // ingredients
    function addIngredient() {
        const id = String(Date.now())
        const list: Ingredient[] = form.getValues('ingredients') ?? []
        form.setValue('ingredients', [...list, { id, name: '', weightGrams: '' }])
    }
    function updateIngredientName(id: string, name: string) {
        const list: Ingredient[] = form.getValues('ingredients') ?? []
        form.setValue(
            'ingredients',
            list.map(i => (i.id === id ? { ...i, name } : i)),
        )
    }
    function updateIngredientAmount(id: string, weightGrams: string) {
        const list: Ingredient[] = form.getValues('ingredients') ?? []
        form.setValue(
            'ingredients',
            list.map(i => (i.id === id ? { ...i, weightGrams } : i)),
        )
    }
    function removeIngredient(id: string) {
        const list: Ingredient[] = form.getValues('ingredients') ?? []
        form.setValue(
            'ingredients',
            list.filter(i => i.id !== id),
        )
    }

    // photoes
    function addPhoto(uri: string) {
        const list: Photo[] = form.getValues('photoes') ?? []
        if (list.length >= 3) return
        const id = String(Date.now())
        form.setValue('photoes', [...list, { id, uri }])
    }
    function removePhoto(id: string) {
        const list: Photo[] = form.getValues('photoes') ?? []
        form.setValue(
            'photoes',
            list.filter(p => p.id !== id),
        )
    }

    return {
        ...form,
        setCategory,
        setUnit,
        addFilling,
        updateFillingName,
        removeFilling,
        addIngredient,
        updateIngredientName,
        updateIngredientAmount,
        removeIngredient,
        addPhoto,
        removePhoto,
    }
}
