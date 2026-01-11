import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'
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

import SelectField from '@/shared/ui/fields/select-field'
import TextareaField from '@/shared/ui/fields/textarea-field'
import UnitField from '@/shared/ui/fields/unit-field'
import SectionCard from '@/shared/ui/section/section-card'

import FillingsEditor from '@/modules/products/components/create&edit/fillings-editor'
import IngredientsEditor from '@/modules/products/components/create&edit/ingredients-editor'
import PhotoesPicker from '@/modules/products/components/create&edit/photoes-picker'

import { pickImagesFromLibrary } from '@/shared/components/media'
import { useCategoryStore } from '@/shared/store/categories.store'
import { useProductsStore } from '@/shared/store/products.store'
import { theme } from '@/shared/theme'
import { useCopyIngredientsFromProduct } from '../hooks/useCopyIngredientsFromProduct'
import type { ProductCreateFormValues } from '../hooks/useProductCreateForm'
import { useProductEditForm } from '../hooks/useProductEditForm'
import { AppStackParamList } from '@/core/navigation/app-navigation'
import { StackNavigationProp } from '@react-navigation/stack'

const MAX_PHOTOES = 3

type Navigation = StackNavigationProp<AppStackParamList, 'ProductEdit'>
type Route = RouteProp<AppStackParamList, 'ProductEdit'>

export default function ProductEditScreen() {
    // объявление ключевых функций
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Navigation>()
    const route = useRoute<Route>()
    const { show } = useToast()

    const productId = route.params.productId
    const product = useProductsStore(s => s.getById(productId))
    const updateProduct = useProductsStore(s => s.updateProduct)
    const { categories } = useCategoryStore()

    const form = useProductEditForm(product)

    //копирование рецептов из другого товара
    const { openCopyIngredients, copyIngredientsModal } = useCopyIngredientsFromProduct({
        excludeProductId: product?.id,
        onApply: copied =>
            setValue('ingredients', copied, { shouldValidate: true, shouldDirty: true }),
        onAfterApply: () =>
            show('Ингредиенты скопированы', 'success', { scope: route.key }),
    })

    //работа с формой
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
    } = form

    const name = watch('name')
    const category = watch('category')
    const unit = watch('unit')
    const price = watch('price')
    const recipe = watch('recipe')
    const fillings = watch('fillings') ?? []
    const ingredients = watch('ingredients') ?? []
    const photoes = watch('photoes') ?? []

    const handleAddPhotoes = useCallback(async () => {
        const remaining = MAX_PHOTOES - photoes.length
        if (remaining <= 0) return

        const picked = await pickImagesFromLibrary({ limit: remaining })
        if (!picked.length) return

        addPhotoes(picked)
    }, [photoes.length, addPhotoes])

    if (!product) return null

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

        const photoesClean = (values.photoes ?? [])
            .filter(p => !!p?.uri)
            .slice(0, MAX_PHOTOES)

        updateProduct(product.id, {
            name: values.name.trim(),
            price: priceNum,
            unit: values.unit,
            category: values.category,
            fillings: fillingsClean,
            ingredients: ingredientsClean,
            recipe: values.recipe ?? '',
            photoes: photoesClean,
        })

        navigation.goBack()
    }

    const onInvalid = makeOnInvalidToast<
        ProductCreateFormValues,
        readonly ['name', 'category', 'price']
    >({
        required: ['name', 'category', 'price'] as const,
        labels: { name: 'Название товара', category: 'Категория', price: 'Цена' },
        show: msg => show(msg, 'error', { scope: route.key }),
    })

    const ingredientsErrors =
        (errors.ingredients as { name?: unknown; weightGrams?: unknown }[] | undefined) ??
        []

    const ingErrorsById: Record<string, { name?: boolean; weightGrams?: boolean }> = {}
    ingredients.forEach((ing, idx) => {
        const e = ingredientsErrors[idx]
        if (e?.name || e?.weightGrams) {
            ingErrorsById[ing.id] = { name: !!e?.name, weightGrams: !!e?.weightGrams }
        }
    })

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showEdit={true}
                        onEditPress={handleSubmit(onValid, onInvalid)}
                        editText="Сохранить"
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
                        <InternalHeaderTitle title="Изменение товара" />
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
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={route.key} bottomOffset={75} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundWhite },
    stickyTopBar: { backgroundColor: theme.colors.backgroundWhite },
    scroll: { flex: 1 },
    titleWrap: {},
    formList: { rowGap: 15 },
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
})
