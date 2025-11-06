// src/modules/products/screens/product-create.screen.tsx
import React from 'react'
import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

import InternalHeader from '@/shared/components/internal-header'
import SectionCard from '@/shared/ui/section/section-card'
import SelectField from '@/shared/ui/fields/select-field'
import UnitField from '@/shared/ui/fields/unit-field'
import TextareaField from '@/shared/ui/fields/textarea-field'
import Button from '@/shared/ui/button/button'

import FillingsEditor from '@/modules/products/components/create/fillings-editor'
import IngredientsEditor from '@/modules/products/components/create/ingredients-editor'
import PhotoesPicker from '@/modules/products/components/create/photoes-picker'

import { theme } from '@/shared/theme'
import { Category } from '@/shared/types/types'
import { useProductCreateForm } from '../hooks/useProductCreateForm'
import ScreenContainer from '@/shared/components/screen-container'

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

    // читаем поля формы реактивно
    const name = watch('name')
    const category = watch('category')
    const unit = watch('unit')
    const price = watch('price')
    const recipe = watch('recipe')
    const fillings = watch('fillings') ?? []
    const ingredients = watch('ingredients') ?? []
    const photoes = watch('photoes') ?? []

    // временные категории до селектора
    const categories: Category[] = [
        { id: 'cakes', name: 'Торты' },
        { id: 'cupcakes', name: 'Капкейки' },
        { id: 'other', name: 'Другое' },
    ]
    function pickCategory() {
        // ...
        setCategory(categories[0])
    }

    // заглушка сохранения
    function onSubmit(values: any) {
        // ...
        navigation.goBack()
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{}}>
                    <View style={styles.headerWrap}>
                        <InternalHeader
                            title="Добавление товара"
                            onBack={() => navigation.goBack()}
                        />
                    </View>

                    {/* название товара */}
                    <SectionCard title="Название товара">
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

                    {/* категория */}
                    <SelectField
                        label="Категория"
                        value={category?.name}
                        onPress={pickCategory}
                        error={!!errors.category}
                    />

                    {/* начинки */}
                    <FillingsEditor
                        fillings={fillings}
                        onAddPress={addFilling}
                        onChangeName={updateFillingName}
                        onRemovePress={removeFilling}
                    />

                    {/* ингредиенты */}
                    <IngredientsEditor
                        ingredients={ingredients}
                        onAddPress={addIngredient}
                        onChangeName={updateIngredientName}
                        onChangeAmount={updateIngredientAmount}
                        onRemovePress={removeIngredient}
                        onCopyPress={() => {
                            // здесь потом откроется копирование из другого товара
                        }}
                    />

                    {/* рецепт */}
                    <TextareaField
                        label="Рецепт"
                        placeholder="Напишите что-нибудь"
                        multiline
                        value={recipe}
                        onChangeText={t => setValue('recipe', t)}
                    />

                    {/* единица измерения */}
                    <UnitField value={unit} onChange={u => setUnit(u)} />

                    {/* цена */}
                    <SectionCard title="Цена">
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

                    {/* фото товара */}
                    <PhotoesPicker
                        photoes={photoes}
                        onAddPress={() => addPhoto('https://picsum.photos/200')}
                        onDeletePress={removePhoto}
                        onPhotoPress={() => {
                            // здесь вызовешь предпросмотр фото
                        }}
                    />
                </ScrollView>

                {/* нижняя кнопка */}
                <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
                    <Button title="Добавить товар" onPress={handleSubmit(onSubmit)} />
                </View>
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundWhite },
    headerWrap: {},
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
