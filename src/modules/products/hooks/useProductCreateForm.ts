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
        category: CategorySchema.nullable(),
        unit: z.enum(['piece', 'kg'] as const),
        price: z.string().trim().min(1, 'обязательное поле'),

        // необязательные поля формы
        recipe: z.string().optional(),

        // массивы могут отсутствовать на входе, но элементы внутри типизированы строго
        fillings: z
            .array(
                z.object({
                    id: z.string(),
                    name: z.string(), // соответствует Filling.name: string
                }),
            )
            .optional(),

        ingredients: z
            .array(
                z.object({
                    id: z.string(),
                    name: z.string(), // соответствует Ingredient.name: string
                    weightGrams: z.string(), // обязательно строка, без undefined
                }),
            )
            .optional(),

        photoes: z
            .array(z.object({ id: z.string(), uri: z.string() }))
            .max(3, 'максимум 3 фото')
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.category) {
            ctx.addIssue({
                code: 'custom',
                path: ['category'],
                message: 'выберите категорию',
            })
        }
    })

// важное: тип формы берем как input-срез схемы, чтобы совпасть с типами zodResolver
export type ProductCreateFormValues = z.input<typeof FormSchema>

export function useProductCreateForm(defaultCategory: Category | null = null) {
    // дефолты храним явно, чтобы контролы всегда имели значения
    const defaultValues: ProductCreateFormValues = useMemo(
        () => ({
            name: '',
            category: defaultCategory,
            unit: 'piece',
            price: '',
            recipe: '',
            fillings: [] as Filling[],
            ingredients: [] as Ingredient[],
            photoes: [] as Photo[],
        }),
        [defaultCategory],
    )

    const form = useForm<ProductCreateFormValues>({
        defaultValues,
        resolver: zodResolver(FormSchema),
        mode: 'onSubmit',
    })

    // простые сеттеры
    function setCategory(c: Category | null) {
        form.setValue('category', c, { shouldValidate: true })
    }
    function setUnit(u: ProductUnit) {
        form.setValue('unit', u, { shouldValidate: true })
    }

    // fillings (Filling[])
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

    // ingredients (Ingredient[])
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
        // fillings
        addFilling,
        updateFillingName,
        removeFilling,
        // ingredients
        addIngredient,
        updateIngredientName,
        updateIngredientAmount,
        removeIngredient,
        // photoes
        addPhoto,
        removePhoto,
    }
}
