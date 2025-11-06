import { Product } from '../types/types'

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Шоколадный торт',
        category: [{ id: 'cakes', name: 'Торты' }],
        price: 2200,
        fillings: [
            { id: '1', name: 'Вишня' },
            { id: '2', name: 'Малина' },
        ],
        unit: 'kg',
        createdAt: '2025-11-02T10:00:00Z',
        updatedAt: '2025-11-02T10:00:00Z',
    },
    {
        id: '2',
        name: 'Капкейки ванильные',
        category: [{ id: 'cupcakes', name: 'Капкейки' }],
        price: 300,
        fillings: [{ id: '3', name: 'Ванильный крем' }],
        unit: 'piece',
        createdAt: '2025-10-12T10:00:00Z',
        updatedAt: '2025-10-12T10:00:00Z',
    },
    {
        id: '3',
        name: 'Макарон с фисташкой',
        category: [{ id: 'macarons', name: 'Макароны' }],
        price: 150,
        unit: 'piece',
        createdAt: '2025-10-12T10:00:00Z',
        updatedAt: '2025-10-12T10:00:00Z',
    },
]
