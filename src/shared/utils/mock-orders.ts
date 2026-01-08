// @/shared/utils/mock-orders.ts
import type { Order, Product } from '../types/types'
import { mockProducts } from './mock-products'

const now = new Date().toISOString()

function getProduct(id: string): Product {
    const p = mockProducts.find(x => x.id === id)
    if (!p) {
        throw new Error(`mock-orders: product "${id}" not found in mock-products`)
    }
    return p
}

const pCakeChocolate = getProduct('1')
const pNapoleon = getProduct('2')
const pCupcakes = getProduct('3')
const pCheesecake = getProduct('4')

export const mockOrders: Order[] = [
    {
        id: '34',
        name: 'Торт для Кого Нибудь',
        clientName: 'Алексей',
        clientPhone: '+7 921 513 5342',
        orderPlatform: 'Avito',
        deliveryType: 'pickup',
        address: '',
        date: '28.12.25',
        time: '17:00',
        products: [
            {
                id: 'ol-34-1',
                product: pCakeChocolate,
                filling: pCakeChocolate.fillings?.find(f => f.name === 'Вишня'),
                amount: 1.6,
                price: pCakeChocolate.price,
                unit: pCakeChocolate.unit,
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
        address: '',
        date: '01.01.26',
        time: '12:30',
        products: [
            {
                id: 'ol-35-1',
                product: pCheesecake,
                filling: pCheesecake.fillings?.[0],
                amount: 2,
                price: pCheesecake.price,
                unit: pCheesecake.unit,
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
        deliveryType: 'delivery',
        address: 'Невский проспект 10',
        date: '28.01.26',
        time: '18:00',
        products: [
            {
                id: 'ol-36-1',
                product: pNapoleon,
                filling: pNapoleon.fillings?.[0],
                amount: 1.95,
                price: pNapoleon.price,
                unit: pNapoleon.unit,
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
        address: '',
        date: '28.01.26',
        time: '16:10',
        products: [
            {
                id: 'ol-87-1',
                product: pCupcakes,
                filling: pCupcakes.fillings?.[0],
                amount: 10,
                price: pCupcakes.price,
                unit: pCupcakes.unit,
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
        address: '',
        date: '28.01.26',
        time: '19:40',
        products: [
            {
                id: 'ol-88-1',
                product: pCakeChocolate,
                filling: pCakeChocolate.fillings?.find(f => f.name === 'Клубника'),
                amount: 1.6,
                price: pCakeChocolate.price,
                unit: pCakeChocolate.unit,
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
