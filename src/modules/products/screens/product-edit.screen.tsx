import { View, StyleSheet, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ScreenContainer from '@/shared/components/screen-container'
import {
    InternalHeaderTopBar,
    InternalHeaderTitle,
} from '@/shared/components/internal-header'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { makeOnInvalidToast } from '@/shared/components/toast/make-on-invalid-toast'

import SectionCard from '@/shared/ui/section/section-card'
import SelectField from '@/shared/ui/fields/select-field'
import UnitField from '@/shared/ui/fields/unit-field'
import TextareaField from '@/shared/ui/fields/textarea-field'
import Button from '@/shared/ui/button/button'

import FillingsEditor from '@/modules/products/components/create/fillings-editor'
import IngredientsEditor from '@/modules/products/components/create/ingredients-editor'
import PhotoesPicker from '@/modules/products/components/create/photoes-picker'

import { theme } from '@/shared/theme'
import { useCategoryStore } from '@/shared/store/categories'
import { useProductsStore } from '@/shared/store/products'
import type { ProductsStackParamList } from '@/core/navigation/products-stack'
import type { ProductCreateFormValues } from '../hooks/useProductCreateForm'
import { useProductEditForm } from '../hooks/useProductEditForm'
import { StackNavigationProp } from '@react-navigation/stack'

type Route = RouteProp<ProductsStackParamList, 'ProductEdit'>
type Navigation = StackNavigationProp<ProductsStackParamList, 'ProductEdit'>

export default function ProductEditScreen() {
    const { bottom } = useSafeAreaInsets()
    const navigation = useNavigation<Navigation>()
    const route = useRoute<Route>()
    const { show } = useToast()

    const productId = route.params.productId
    const product = useProductsStore(s => s.getById(productId))
    const updateProduct = useProductsStore(s => s.updateProduct)
    const { categories } = useCategoryStore()

    const form = useProductEditForm(product)

    useEffect(() => {
        if (!product) navigation.goBack()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, !!product])

    if (!product) return null

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
    } = form

    const name = watch('name')
    const category = watch('category')
    const unit = watch('unit')
    const price = watch('price')
    const recipe = watch('recipe')
    const fillings = watch('fillings') ?? []
    const ingredients = watch('ingredients') ?? []
    const photoes = watch('photoes') ?? []

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

        const photoUris = (values.photoes ?? []).map(p => p.uri).filter(Boolean)

        updateProduct(product.id, {
            name: values.name.trim(),
            price: priceNum,
            unit: values.unit,
            category: values.category,
            fillings: fillingsClean,
            ingredients: ingredientsClean,
            recipe: values.recipe ?? '',
            photoes: photoUris,
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
                    <InternalHeaderTopBar onBack={() => navigation.goBack()} />
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
                                selectTextOnFocus={false}
                                scrollEnabled={false}
                            />
                        </SectionCard>

                        <PhotoesPicker
                            photoes={photoes}
                            onAddPress={() => addPhoto('https://picsum.photos/200')}
                            onDeletePress={removePhoto}
                            onPhotoPress={() => {}}
                        />

                        <Button
                            title="Сохранить изменения"
                            onPress={handleSubmit(onValid, onInvalid)}
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
