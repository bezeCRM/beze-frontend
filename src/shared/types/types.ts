// заказы
export type ProductUnit = 'piece' | 'kg'
export type PhotoItem = { id: string; uri: string }

export type Product = {
    id: string
    name: string
    category?: Category
    price: number
    fillings?: Filling[]
    ingredients?: Ingredient[]
    recipe?: string
    unit: ProductUnit
    photoes?: PhotoItem[]
    createdAt: string
    updatedAt: string
}

export type Category = {
    id: string
    name: string
}

export type Filling = {
    id: string
    name: string
}

export type Ingredient = {
    id: string
    name: string
    weightGrams: string
}

// заказы
export type OrderStatus = 'new' | 'inWork' | 'ready' | 'delivered' | 'canceled'
export type OrderPaymentStatus = 'unpaid' | 'partial' | 'paid'

export type OrderDeliveryType = 'pickup' | 'delivery'

export type OrderExtra = {
    delivery: number
    urgency: number
    other: number
    discount: number
}

export type OrderDecorPrice = {
    id: string
    name: string
    price: number
}

export type OrderProductLine = {
    id: string
    product: Product
    amount: number
    filling?: Filling
    price: number
    unit: ProductUnit
}

export type Order = {
    id: string
    name?: string

    clientName: string
    clientPhone?: string
    orderPlatform?: string

    deliveryType: OrderDeliveryType
    address?: string

    date?: string
    time?: string

    products: OrderProductLine[]
    decorPrices?: OrderDecorPrice[]
    extra?: OrderExtra

    notes?: string
    references?: PhotoItem[]

    paymentStatus: OrderPaymentStatus
    status: OrderStatus

    inPlanner: boolean

    totalPrice: number

    createdAt: string
    updatedAt: string
}
