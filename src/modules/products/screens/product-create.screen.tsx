import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'

import {
    InternalHeaderTopBar,
    InternalHeaderTitle,
} from '@/shared/components/internal-header'
import SectionCard from '@/shared/ui/section/section-card'
import SelectField from '@/shared/ui/fields/select-field'
import UnitField from '@/shared/ui/fields/unit-field'
import TextareaField from '@/shared/ui/fields/textarea-field'
import Button from '@/shared/ui/button/button'

import FillingsEditor from '@/modules/products/components/create/fillings-editor'
import IngredientsEditor from '@/modules/products/components/create/ingredients-editor'
import PhotoesPicker from '@/modules/products/components/create/photoes-picker'

import { theme } from '@/shared/theme'
import {
    ProductCreateFormValues,
    useProductCreateForm,
} from '../hooks/useProductCreateForm'
import ScreenContainer from '@/shared/components/screen-container'
import { useCategoryStore } from '@/shared/store/categories'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { makeOnInvalidToast } from '@/shared/components/toast/make-on-invalid-toast'
import { useMemo } from 'react'
import { NewProductInput, useProductsStore } from '@/shared/store/products'

export default function ProductCreateScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation()

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
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
    } = useProductCreateForm()

    const name = watch('name')
    const category = watch('category')
    const unit = watch('unit')
    const price = watch('price')
    const recipe = watch('recipe')
    const fillings = watch('fillings') ?? []
    const rawIngredients = watch('ingredients')
    const ingredients = useMemo(() => rawIngredients ?? [], [rawIngredients])
    const photoes = watch('photoes') ?? []

    const { categories } = useCategoryStore()

    // form check + errors
    const route = useRoute()
    const { show } = useToast()

    const addProduct = useProductsStore(s => s.addProduct)

    const onValid = (values: ProductCreateFormValues) => {
        const priceNum = Number(String(values.price).replace(/\s/g, '')) || 0

        const fillingsClean = (values.fillings ?? [])
            .map(f => ({ id: f.id, name: f.name.trim() }))
            .filter(f => f.name.length > 0)

        const ingredientsClean = (values.ingredients ?? [])
            .map(i => ({
                id: i.id,
                name: i.name.trim(),
                weightGrams: i.weightGrams.trim(),
            }))
            .filter(i => i.name.length > 0 || i.weightGrams.length > 0)

        const recipeClean = values.recipe?.trim()
        const photoUri = values.photoes?.[0]?.uri

        const newProduct: NewProductInput = {
            name: values.name.trim(),
            price: priceNum,
            unit: values.unit,
            ...(values.category
                ? { category: { id: values.category.id, name: values.category.name } }
                : {}),
            ...(fillingsClean.length ? { fillings: fillingsClean } : {}),
            ...(ingredientsClean.length ? { ingredients: ingredientsClean } : {}),
            ...(recipeClean ? { recipe: recipeClean } : {}),
            ...(photoUri ? { photo: photoUri } : {}),
        }

        console.log('добавляем товар:', JSON.stringify(newProduct, null, 2))
        const id = addProduct(newProduct)
        console.log('товар успешно добавлен с id:', id)

        navigation.goBack()
    }

    const onInvalid = makeOnInvalidToast<
        ProductCreateFormValues,
        readonly ['name', 'category', 'price']
    >({
        required: ['name', 'category', 'price'] as const,
        labels: { name: 'Название товара', category: 'Категория', price: 'Цена' },
        show: msg => show(msg, 'error', { scope: route.key }),
        extra: formErrors => {
            const out: string[] = []
            const errs: any[] | undefined = (formErrors as any).ingredients
            if (Array.isArray(errs)) {
                errs.forEach((e, idx) => {
                    if (e?.name) out.push(`Ингредиент ${idx + 1} — Название`)
                    if (e?.weightGrams) out.push(`Ингредиент ${idx + 1} — Вес`)
                })
            }
            return out
        },
    })

    const ingErrorsById = useMemo(() => {
        const ingredientsErrors =
            (errors.ingredients as
                | { name?: unknown; weightGrams?: unknown }[]
                | undefined) ?? []

        const map: Record<string, { name?: boolean; weightGrams?: boolean }> = {}
        ingredients.forEach((ing, idx) => {
            const e = ingredientsErrors[idx]
            if (e?.name || e?.weightGrams) {
                map[ing.id] = { name: !!e?.name, weightGrams: !!e?.weightGrams }
            }
        })
        return map
    }, [ingredients, errors.ingredients])

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={[styles.stickyTopBar]}>
                    <InternalHeaderTopBar onBack={() => navigation.goBack()} />
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: bottom }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.titleWrap}>
                        <InternalHeaderTitle title="Добавление товара" />
                    </View>

                    <View style={styles.formList}>
                        <SectionCard title="Название товара *">
                            <TextInput
                                value={name}
                                onChangeText={t =>
                                    setValue('name', t, { shouldValidate: true })
                                }
                                placeholder="Шоколадный торт"
                                placeholderTextColor={theme.colors.mainGray}
                                style={[styles.input, errors.name && styles.inputError]}
                                returnKeyType="done"
                            />
                        </SectionCard>

                        <SelectField
                            label="Категория"
                            options={categories}
                            selectedId={category?.id ?? null}
                            onSelect={opt => setCategory(opt)}
                            error={!!errors.category}
                        />

                        <FillingsEditor
                            fillings={fillings}
                            onAddPress={addFilling}
                            onChangeName={updateFillingName}
                            onRemovePress={removeFilling}
                        />

                        <IngredientsEditor
                            ingredients={ingredients}
                            onAddPress={addIngredient}
                            onChangeName={updateIngredientName}
                            onChangeAmount={updateIngredientAmount}
                            onRemovePress={removeIngredient}
                            onCopyPress={() => {}}
                            errorsById={ingErrorsById}
                        />

                        <TextareaField
                            label="Рецепт"
                            placeholder="Напишите что-нибудь"
                            multiline
                            value={recipe}
                            onChangeText={t => setValue('recipe', t)}
                        />

                        <UnitField value={unit} onChange={u => setUnit(u)} />

                        <SectionCard title="Цена *">
                            <TextInput
                                value={price}
                                onChangeText={t =>
                                    setValue('price', t, { shouldValidate: true })
                                }
                                placeholder={
                                    unit === 'piece'
                                        ? 'Введите цену за 1 шт'
                                        : 'Введите цену за 1 кг'
                                }
                                placeholderTextColor={theme.colors.mainGray}
                                style={[styles.input, errors.price && styles.inputError]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </SectionCard>

                        <PhotoesPicker
                            photoes={photoes}
                            onAddPress={() => addPhoto('https://picsum.photos/200')}
                            onDeletePress={removePhoto}
                            onPhotoPress={() => {}}
                        />
                    </View>
                </ScrollView>

                {/* нижняя кнопка */}
                <View style={[styles.footer, { paddingBottom: bottom + 10 }]}>
                    <Button
                        title="Добавить товар"
                        onPress={handleSubmit(onValid, onInvalid)}
                    />
                </View>
                <ToastViewport scope={route.key} bottomOffset={75} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundWhite },

    stickyTopBar: {
        backgroundColor: theme.colors.backgroundWhite,
    },

    scroll: {
        flex: 1,
    },

    titleWrap: {},

    formList: {
        rowGap: 15,
    },

    input: {
        backgroundColor: theme.colors.mainWhite,
        height: 40,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        fontSize: 14,
        color: theme.colors.mainBlack,
    },
    inputError: { borderColor: theme.colors.errorRed },

    footer: {},
})
