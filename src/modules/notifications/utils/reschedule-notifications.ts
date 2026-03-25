import * as Notifications from 'expo-notifications'

import type { Order } from '@/shared/types/types'
import type { NotificationSettings } from '@/modules/notifications/store/notification-settings.store'
import { cutOrderId } from '@/shared/utils/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Объединяет date ('2025-06-15') и time ('14:30') в объект Date */
function buildPickupDate(date: string, time: string): Date {
    // Безопасный разбор без риска timezone-сдвига
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    const d = new Date()
    d.setFullYear(year, month - 1, day)
    d.setHours(hours, minutes, 0, 0)
    return d
}

/** Парсит cookingReminder: '4h' → 4 (часы) */
function parseCookingHours(value: string): number {
    return parseInt(value, 10) // '3h' → 3, '8h' → 8
}

/** Парсит pickupReminder в минуты: '30min' → 30, '1h' → 60, '2h' → 120 */
function parsePickupMinutes(value: string): number {
    if (value.endsWith('min')) return parseInt(value, 10)
    return parseInt(value, 10) * 60
}

/** Человекочитаемое название заказа для тела уведомления */
function orderTitle(order: Order): string {
    return order.name?.trim() ? order.name : `#${cutOrderId(order.id)}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Полностью пересчитывает все запланированные уведомления.
 * Вызывать при:
 *   - изменении настроек уведомлений
 *   - создании / редактировании / удалении заказа
 *   - старте приложения (после hydration сторов)
 *
 * Только заказы со статусом, не являющимся финальным, участвуют в планировании.
 * Уведомления в прошлом молча пропускаются.
 */
export async function rescheduleOrderNotifications(
    orders: Order[],
    settings: NotificationSettings,
): Promise<void> {
    // Сбрасываем всё — проще чем диффить
    await Notifications.cancelAllScheduledNotificationsAsync()

    const allDisabled =
        settings.eveningReminder === 'disabled' &&
        settings.cookingReminder === 'disabled' &&
        settings.pickupReminder === 'disabled'

    if (allDisabled) return

    const now = Date.now()

    // Фильтруем только активные заказы (не готовые / не отменённые/ не выданные)
    const activeOrders = orders.filter(
        o => o.status !== 'ready' && o.status !== 'canceled' && o.status !== 'delivered',
    )

    for (const order of activeOrders) {
        const pickupAt = buildPickupDate(order.date, order.time)
        const title = orderTitle(order)

        // ── 1. Накануне вечером ──────────────────────────────────────────────
        if (settings.eveningReminder !== 'disabled') {
            const [h, m] = settings.eveningReminder.split(':').map(Number)

            const triggerAt = new Date(pickupAt)
            triggerAt.setDate(triggerAt.getDate() - 1) // предыдущий день
            triggerAt.setHours(h, m, 0, 0)

            if (triggerAt.getTime() > now) {
                await Notifications.scheduleNotificationAsync({
                    identifier: `evening_${order.id}`,
                    content: {
                        title: 'Заказы на завтра',
                        body: `Завтра первая выдача: "${title}" в ${order.time}`,
                        data: { orderId: order.id, type: 'evening' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerAt,
                        channelId: 'orders',
                    },
                })
            }
        }

        // ── 2. Напомнить начать готовить ─────────────────────────────────────
        if (settings.cookingReminder !== 'disabled') {
            const hoursBefore = parseCookingHours(settings.cookingReminder)
            const triggerAt = new Date(pickupAt.getTime() - hoursBefore * 60 * 60 * 1000)

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

        // ── 3. Перед выдачей ─────────────────────────────────────────────────
        if (settings.pickupReminder !== 'disabled') {
            const minutesBefore = parsePickupMinutes(settings.pickupReminder)
            const triggerAt = new Date(pickupAt.getTime() - minutesBefore * 60 * 1000)

            const label =
                settings.pickupReminder === '30min'
                    ? '30 минут'
                    : `${minutesBefore / 60} ч`

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
}
