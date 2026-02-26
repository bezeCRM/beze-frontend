import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { makeOnInvalidToast } from '@/shared/components/toast/make-on-invalid-toast'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'

import Button from '@/shared/ui/button/button'
import SelectField from '@/shared/ui/fields/select-field'
import TextareaField from '@/shared/ui/fields/textarea-field'
import UnitField from '@/shared/ui/fields/unit-field'
import SectionCard from '@/shared/ui/section/section-card'

import FillingsEditor from '@/modules/products/components/create&edit/fillings-editor'
import IngredientsEditor from '@/modules/products/components/create&edit/ingredients-editor'
import PhotoesPicker from '@/modules/products/components/create&edit/photoes-picker'

import { pickImagesFromLibrary } from '@/shared/components/media'
import { useCategoryStore } from '../store/categories.store'
import type { NewProductInput } from '../store/products.store'
import { useProductsStore } from '../store/products.store'

import { useCopyIngredientsFromProduct } from '../hooks/useCopyIngredientsFromProduct'
import {
    type ProductCreateFormValues,
    useProductCreateForm,
} from '../hooks/useProductCreateForm'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Nav, Route } from '@/core/navigation/types'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { toApiError } from '@/api/http/errors'
import { sanitizeRubInt } from '@/shared/utils/utils'

const MAX_PHOTOES = 3

export default function ProductCreateScreen() {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Nav>()
    const route = useRoute<Route<'ProductCreate'>>()
    const { show } = useToast()

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
        addPhotoes,
        removePhoto,
        hasDraft,
        clearDraft,
    } = useProductCreateForm()

    // копирование ингредиентов из другого товара
    const { openCopyIngredients, copyIngredientsModal } = useCopyIngredientsFromProduct({
        onApply: copied =>
            setValue('ingredients', copied, { shouldValidate: true, shouldDirty: true }),
        onAfterApply: () =>
            show('Ингредиенты скопированы', 'success', { scope: route.key }),
    })

    const name = watch('name')
    const category = watch('category')
    const unit = watch('unit')
    const price = watch('price')
    const recipe = watch('recipe')
    const fillings = watch('fillings') ?? []
    const rawIngredients = watch('ingredients')
    const ingredients = useMemo(() => rawIngredients ?? [], [rawIngredients])
    const photoes = watch('photoes') ?? []

    function normalizePriceToInt(value: unknown): number {
        const n =
            typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
        if (!Number.isFinite(n)) return 0
        return Math.max(0, Math.round(n))
    }

    const { categories } = useCategoryStore()
    const addProduct = useProductsStore(s => s.addProduct)

    const handleAddPhotoes = useCallback(async () => {
        const remaining = MAX_PHOTOES - photoes.length
        if (remaining <= 0) return

        const picked = await pickImagesFromLibrary({ limit: remaining })
        if (!picked.length) return

        addPhotoes(picked)
    }, [photoes.length, addPhotoes])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onValid = async (values: ProductCreateFormValues) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
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
            const photoesClean = (values.photoes ?? [])
                .filter(p => !!p?.uri)
                .slice(0, MAX_PHOTOES)

            const createdName = values.name.trim()

            const newProduct: NewProductInput = {
                name: createdName,
                price: normalizePriceToInt(priceNum),
                unit: values.unit,
                ...(values.category ? { category: values.category } : {}),
                ...(fillingsClean.length ? { fillings: fillingsClean } : {}),
                ...(ingredientsClean.length ? { ingredients: ingredientsClean } : {}),
                ...(recipeClean ? { recipe: recipeClean } : {}),
                ...(photoesClean.length ? { photoes: photoesClean } : {}),
            }

            await addProduct(newProduct)
            clearDraft()

            navigation.goBack()

            requestAnimationFrame(() => {
                show(`Товар "${createdName}" добавлен`, 'success', {
                    scope: TOAST_SCOPES.Products,
                })
            })
        } catch (e) {
            show(toApiError(e).message, 'error', { scope: route.key })
        } finally {
            setIsSubmitting(false)
        }
    }

    const onInvalid = makeOnInvalidToast<
        ProductCreateFormValues,
        readonly ['name', 'price']
    >({
        required: ['name', 'price'] as const,
        labels: { name: 'Название товара', price: 'Цена' },
        show: msg => show(msg, 'error', { scope: route.key }),
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
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction={hasDraft}
                        onActionPress={hasDraft ? clearDraft : undefined}
                        actionText={hasDraft ? 'Очистить' : undefined}
                    />
                </View>

                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    enableAutomaticScroll
                    extraScrollHeight={80}
                    extraHeight={80}
                    enableResetScrollToCoords={false}
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.titleWrap}>
                        <InternalHeaderTitle title="Добавление товара" />
                    </View>

                    <View style={styles.formList}>
                        <SectionCard title="Название товара" required>
                            <TextInput
                                value={name}
                                onChangeText={t =>
                                    setValue('name', t, { shouldValidate: true })
                                }
                                placeholder="Шоколадный торт"
                                placeholderTextColor={colors.textMuted}
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
                            toastScope={route.key}
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
                            onCopyPress={openCopyIngredients}
                            errorsById={ingErrorsById}
                        />
                        {copyIngredientsModal}

                        <TextareaField
                            label="Рецепт"
                            placeholder="Напишите что-нибудь"
                            multiline
                            value={recipe}
                            onChangeText={t => setValue('recipe', t)}
                        />

                        <UnitField value={unit} onChange={u => setUnit(u)} />

                        <SectionCard title="Цена" required>
                            <TextInput
                                value={price}
                                onChangeText={t =>
                                    setValue('price', sanitizeRubInt(t), {
                                        shouldValidate: true,
                                    })
                                }
                                placeholder={
                                    unit === 'piece'
                                        ? 'Введите цену за 1 шт'
                                        : 'Введите цену за 1 кг'
                                }
                                placeholderTextColor={colors.textMuted}
                                style={[styles.input, errors.price && styles.inputError]}
                                keyboardType="numeric"
                                returnKeyType="done"
                                selectTextOnFocus={false}
                                scrollEnabled={false}
                            />
                        </SectionCard>

                        <PhotoesPicker
                            photoes={photoes}
                            maxCount={MAX_PHOTOES}
                            onAddPress={() => {
                                void handleAddPhotoes()
                            }}
                            onDeletePress={removePhoto}
                            onPhotoPress={() => {}}
                        />

                        <Button
                            title="Добавить товар"
                            onPress={handleSubmit(onValid, onInvalid)}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        />
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={route.key} bottomOffset={25} />
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        stickyTopBar: { backgroundColor: theme.colors.background },
        scroll: { flex: 1 },
        titleWrap: {},
        formList: { rowGap: 15 },
        input: {
            backgroundColor: theme.colors.surface,
            minHeight: 40,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            color: theme.colors.text,
        },
        inputError: { borderColor: theme.colors.danger },
    }),
)
