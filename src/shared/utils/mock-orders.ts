import type { Order, Product } from '../types/types'

const now = new Date().toISOString()

const p1: Product = {
    id: 'p-1',
    name: 'Шоколадный торт',
    price: 2200,
    unit: 'kg',
    createdAt: now,
    updatedAt: now,
}

const p2: Product = {
    id: 'p-2',
    name: 'Торт',
    price: 5200,
    unit: 'piece',
    createdAt: now,
    updatedAt: now,
}

const p3: Product = {
    id: 'p-3',
    name: 'Шоколадный торт',
    price: 3500,
    unit: 'piece',
    createdAt: now,
    updatedAt: now,
}

export const mockOrders: Order[] = [
    {
        id: '34',
        name: 'Торт для Кого Нибудь',
        clientName: 'Алексей',
        clientPhone: '+7 921 513 5342',
        orderPlatform: 'Avito',
        deliveryType: 'pickup',
        date: '28.12.2025',
        products: [
            {
                id: 'ol-1',
                product: p1,
                amount: 1.6,
                price: 2200,
                unit: 'kg',
            },
        ],
        paymentStatus: 'paid',
        status: 'inWork',
        inPlanner: true,
        totalPrice: 3500,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: '35',
        name: 'Название заказа с каким-то длинным описанием или названием',
        clientName: 'Мария',
        deliveryType: 'pickup',
        date: '01.01.2026',
        products: [
            {
                id: 'ol-2',
                product: p2,
                amount: 1,
                price: 5200,
                unit: 'piece',
            },
        ],
        paymentStatus: 'unpaid',
        status: 'new',
        inPlanner: false,
        totalPrice: 5200,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: '36',
        name: 'Торт для Кого Нибудь ещё',
        clientName: 'Ирина',
        deliveryType: 'pickup',
        date: '28.01.2026',
        products: [
            {
                id: 'ol-3',
                product: p3,
                amount: 1,
                price: 3500,
                unit: 'piece',
            },
        ],
        paymentStatus: 'paid',
        status: 'ready',
        inPlanner: true,
        totalPrice: 3500,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: '87',
        name: 'Заказ №87',
        clientName: 'Сергей',
        deliveryType: 'pickup',
        date: '28.01.2026',
        products: [
            {
                id: 'ol-4',
                product: p3,
                amount: 1,
                price: 3500,
                unit: 'piece',
            },
        ],
        paymentStatus: 'partial',
        status: 'canceled',
        inPlanner: false,
        totalPrice: 3500,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: '88',
        name: 'Торт для Кого Нибудь ещё',
        clientName: 'Анна',
        deliveryType: 'pickup',
        date: '28.01.2026',
        products: [
            {
                id: 'ol-5',
                product: p3,
                amount: 1,
                price: 3500,
                unit: 'piece',
            },
        ],
        paymentStatus: 'paid',
        status: 'delivered',
        inPlanner: true,
        totalPrice: 3500,
        createdAt: now,
        updatedAt: now,
    },
]
