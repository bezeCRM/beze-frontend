import Constants from 'expo-constants'
import { Platform } from 'react-native'

import type { Order } from '@/shared/types/types'
import type { NotificationSettings } from '@/modules/notifications/store/notification-settings.store'
import { cutOrderId } from '@/shared/utils/utils'

type EveningGroup = {
    triggerAt: Date
    count: number
    firstOrder: Order
    firstPickupTime: number
}

let scheduleQueue: Promise<void> = Promise.resolve()
let latestRequestId = 0

function buildPickupDate(date: string, time: string): Date {
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)

    return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

function orderTitle(order: Order): string {
    return order.name?.trim() ? order.name : `#${cutOrderId(order.id)}`
}

async function applySchedule(
    orders: Order[],
    settings: NotificationSettings,
): Promise<void> {
    if (Platform.OS === 'android' && Constants.expoGoConfig != null) {
        return
    }

    const Notifications = await import('expo-notifications')

    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    const prefixes = ['evening_', 'cooking_', 'pickup_']

    await Promise.all(
        scheduled
            .filter(item => prefixes.some(prefix => item.identifier.startsWith(prefix)))
            .map(item => Notifications.cancelScheduledNotificationAsync(item.identifier)),
    )

    const allDisabled =
        settings.eveningReminder === 'disabled' &&
        settings.cookingReminder === 'disabled' &&
        settings.pickupReminder === 'disabled'

    if (allDisabled) return

    const now = Date.now()
    const eveningGroups = new Map<number, EveningGroup>()

    const uniqueOrders = [...new Map(orders.map(order => [order.id, order])).values()]

    const activeOrders = uniqueOrders.filter(
        order =>
            order.status !== 'ready' &&
            order.status !== 'canceled' &&
            order.status !== 'delivered',
    )

    for (const order of activeOrders) {
        const pickupAt = buildPickupDate(order.date, order.time)
        const pickupTime = pickupAt.getTime()

        if (!Number.isFinite(pickupTime)) continue

        const title = orderTitle(order)

        if (settings.eveningReminder !== 'disabled') {
            const [hours, minutes] = settings.eveningReminder.split(':').map(Number)

            const triggerAt = new Date(pickupAt)
            triggerAt.setDate(triggerAt.getDate() - 1)
            triggerAt.setHours(hours, minutes, 0, 0)

            const key = triggerAt.getTime()

            if (key > now) {
                const group = eveningGroups.get(key)

                if (group) {
                    group.count += 1

                    if (pickupTime < group.firstPickupTime) {
                        group.firstOrder = order
                        group.firstPickupTime = pickupTime
                    }
                } else {
                    eveningGroups.set(key, {
                        triggerAt,
                        count: 1,
                        firstOrder: order,
                        firstPickupTime: pickupTime,
                    })
                }
            }
        }

        if (settings.cookingReminder !== 'disabled') {
            const hoursBefore = parseInt(settings.cookingReminder, 10)
            const triggerAt = new Date(pickupTime - hoursBefore * 60 * 60 * 1000)

            if (triggerAt.getTime() > now) {
                await Notifications.scheduleNotificationAsync({
                    identifier: `cooking_${order.id}`,
                    content: {
                        title: 'Пора начинать готовить',
                        body: `Выдача заказа "${title}" в ${order.time} — осталось ${hoursBefore} ч`,
                        data: { orderId: order.id, type: 'cooking' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerAt,
                        channelId: 'orders',
                    },
                })
            }
        }

        if (settings.pickupReminder !== 'disabled') {
            const minutesBefore = settings.pickupReminder.endsWith('min')
                ? parseInt(settings.pickupReminder, 10)
                : parseInt(settings.pickupReminder, 10) * 60

            const triggerAt = new Date(pickupTime - minutesBefore * 60 * 1000)

            const label = minutesBefore === 30 ? '30 минут' : `${minutesBefore / 60} ч`

            if (triggerAt.getTime() > now) {
                await Notifications.scheduleNotificationAsync({
                    identifier: `pickup_${order.id}`,
                    content: {
                        title: 'Скоро выдача заказа',
                        body: `"${title}" нужно отдать через ${label}`,
                        data: { orderId: order.id, type: 'pickup' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerAt,
                        channelId: 'orders',
                    },
                })
            }
        }
    }

    for (const [key, group] of eveningGroups) {
        const firstOrder = group.firstOrder
        const title = orderTitle(firstOrder)

        const body =
            group.count === 1
                ? `Завтра выдача заказа "${title}" в ${firstOrder.time}`
                : `Завтра заказов: ${group.count}. Первая выдача: "${title}" в ${firstOrder.time}`

        await Notifications.scheduleNotificationAsync({
            identifier: `evening_${key}`,
            content: {
                title: 'Заказы на завтра',
                body,
                data: {
                    orderId: firstOrder.id,
                    type: 'evening',
                    orderCount: group.count,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: group.triggerAt,
                channelId: 'orders',
            },
        })
    }
}

export function rescheduleOrderNotifications(
    orders: Order[],
    settings: NotificationSettings,
): Promise<void> {
    const requestId = ++latestRequestId
    const ordersSnapshot = [...orders]
    const settingsSnapshot = { ...settings }

    const task = scheduleQueue
        .catch(() => undefined)
        .then(async () => {
            if (requestId !== latestRequestId) return

            await applySchedule(ordersSnapshot, settingsSnapshot)
        })

    scheduleQueue = task

    return task
}
