import type { Product } from '../types/types'

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Шоколадный торт',
        category: { id: 'cakes', name: 'Торты' },
        price: 2200,
        fillings: [
            { id: 'f1', name: 'Клубника' },
            { id: 'f2', name: 'Вишня' },
        ],
        ingredients: [
            { id: 'i1', name: 'Мука', weightGrams: '250' },
            { id: 'i2', name: 'Яйца', weightGrams: '150' },
            { id: 'i3', name: 'Шоколад', weightGrams: '200' },
        ],
        recipe: 'Смешать ингредиенты и выпекать при 180° 40 минут.',
        unit: 'kg',
        photoes: [
            {
                id: 'p1-1',
                uri: 'https://raw.githubusercontent.com/filippella/Dagger-Rx-Database-MVP/master/cakes/chocolate_cake.jpg',
            },
        ],
        createdAt: '2025-11-01T12:00:00.000Z',
        updatedAt: '2025-11-05T09:15:00.000Z',
    },
    {
        id: '2',
        name: 'Торт Наполеон',
        category: { id: 'cakes', name: 'Торты' },
        price: 1800,
        fillings: [{ id: 'f3', name: 'Крем заварной' }],
        ingredients: [
            { id: 'i4', name: 'Мука', weightGrams: '300' },
            { id: 'i5', name: 'Сливочное масло', weightGrams: '200' },
            { id: 'i6', name: 'Молоко', weightGrams: '250' },
        ],
        recipe: 'Тонкие коржи и крем из молока, масла и сахара.',
        unit: 'kg',
        photoes: [
            {
                id: 'p2-1',
                uri: 'https://raw.githubusercontent.com/filippella/Dagger-Rx-Database-MVP/master/cakes/victoria_sponge.jpg',
            },
        ],
        createdAt: '2025-10-29T10:22:00.000Z',
        updatedAt: '2025-11-02T18:10:00.000Z',
    },
    {
        id: '3',
        name: 'Капкейки ванильные',
        category: { id: 'cupcakes', name: 'Капкейки' },
        price: 350,
        fillings: [{ id: 'f4', name: 'Малина' }],
        ingredients: [
            { id: 'i7', name: 'Мука', weightGrams: '120' },
            { id: 'i8', name: 'Сахар', weightGrams: '80' },
            { id: 'i9', name: 'Яйца', weightGrams: '100' },
        ],
        recipe: 'Смешать ингредиенты, разлить по формам и запечь.',
        unit: 'piece',
        photoes: [
            {
                id: 'p3-1',
                uri: 'https://raw.githubusercontent.com/filippella/Dagger-Rx-Database-MVP/master/cakes/carrot_cake.jpg',
            },
        ],
        createdAt: '2025-10-15T14:05:00.000Z',
        updatedAt: '2025-10-16T08:30:00.000Z',
    },
    {
        id: '4',
        name: 'Чизкейк Нью-Йорк',
        category: { id: 'cakes', name: 'Торты' },
        price: 2600,
        fillings: [{ id: 'f5', name: 'Сырный крем' }],
        ingredients: [
            { id: 'i10', name: 'Творожный сыр', weightGrams: '300' },
            { id: 'i11', name: 'Печенье', weightGrams: '150' },
            { id: 'i12', name: 'Сливки', weightGrams: '200' },
        ],
        recipe: 'Классический чизкейк на песочной основе.',
        unit: 'kg',
        photoes: [
            {
                id: 'p4-1',
                uri: 'https://raw.githubusercontent.com/filippella/Dagger-Rx-Database-MVP/master/cakes/banana_cake.jpg',
            },
        ],
        createdAt: '2025-10-05T11:00:00.000Z',
        updatedAt: '2025-11-03T10:00:00.000Z',
    },
    {
        id: '5',
        name: 'Пирожное картошка',
        category: { id: 'desserts', name: 'Десерты' },
        price: 120,
        ingredients: [
            { id: 'i13', name: 'Печенье', weightGrams: '100' },
            { id: 'i14', name: 'Какао', weightGrams: '20' },
            { id: 'i15', name: 'Сгущёнка', weightGrams: '80' },
        ],
        unit: 'piece',
        recipe: 'Смешать измельчённое печенье с какао и сгущёнкой.',
        photoes: [
            {
                id: 'p5-1',
                uri: 'https://raw.githubusercontent.com/filippella/Dagger-Rx-Database-MVP/master/cakes/strawberry_cake.jpg',
            },
        ],
        createdAt: '2025-09-20T08:00:00.000Z',
        updatedAt: '2025-11-01T09:40:00.000Z',
    },
]
