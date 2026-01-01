import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Category,
    ProductUnit,
    Filling,
    Ingredient,
    PhotoItem,
} from '@/shared/types/types'

const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
})

const FormSchema = z
    .object({
        name: z.string().trim().min(1, 'обязательное поле'),
        category: CategorySchema.optional(),
        unit: z.enum(['piece', 'kg'] as const),
        price: z.string().trim().min(1, 'обязательное поле'),

        recipe: z.string().optional(),
        fillings: z.array(z.object({ id: z.string(), name: z.string() })).optional(),

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

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useProductCreateForm(defaultCategory?: Category) {
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
            photoes: [] as PhotoItem[],
        }
        return defaultCategory ? { ...base, category: defaultCategory } : base
    }, [defaultCategory])

    const form = useForm<ProductCreateFormValues>({
        defaultValues,
        resolver: zodResolver(FormSchema),
        mode: 'onSubmit',
    })

    function setCategory(c?: Category | null) {
        form.setValue('category', c ?? undefined, { shouldValidate: true })
    }

    function setUnit(u: ProductUnit) {
        form.setValue('unit', u, { shouldValidate: true })
    }

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

    function addPhotoes(items: PhotoItem[]) {
        const list: PhotoItem[] = form.getValues('photoes') ?? []
        if (list.length >= 3) return

        const remaining = 3 - list.length
        const seen = new Set(list.map(p => p.uri))
        const toAdd: PhotoItem[] = []

        for (const p of items) {
            if (toAdd.length >= remaining) break
            if (!p?.uri) continue
            if (seen.has(p.uri)) continue
            seen.add(p.uri)
            toAdd.push({ id: p.id || makeId(), uri: p.uri })
        }

        if (!toAdd.length) return
        form.setValue('photoes', [...list, ...toAdd], { shouldValidate: true })
    }

    function addPhoto(uri: string) {
        if (!uri) return
        const list: PhotoItem[] = form.getValues('photoes') ?? []
        if (list.length >= 3) return
        if (list.some(p => p.uri === uri)) return
        form.setValue('photoes', [...list, { id: makeId(), uri }], {
            shouldValidate: true,
        })
    }

    function removePhoto(id: string) {
        const list: PhotoItem[] = form.getValues('photoes') ?? []
        form.setValue(
            'photoes',
            list.filter(p => p.id !== id),
            { shouldValidate: true },
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
        addPhotoes,
        addPhoto,
        removePhoto,
    }
}
