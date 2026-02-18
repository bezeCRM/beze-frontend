import { IconName } from '@/shared/ui/icon/icon'
import type { HelpTextKey } from './help-text'

export type HelpSection = {
    id: string
    title: string
    icon: IconName
    textKey: HelpTextKey
}

export const HELP_SECTIONS: HelpSection[] = [
    {
        id: 'contact',
        title: 'Связаться с нами',
        icon: 'contact-us-icon',
        textKey: 'contact',
    },
    { id: 'planner', title: 'Планер', icon: 'planner-icon', textKey: 'planner' },
    { id: 'orders', title: 'Заказы', icon: 'orders-icon', textKey: 'orders' },
    { id: 'products', title: 'Товары', icon: 'products-icon', textKey: 'products' },
    {
        id: 'finances',
        title: 'Финансы',
        icon: 'profile/finances-icon',
        textKey: 'finances',
    },
    {
        id: 'settings',
        title: 'Настройки',
        icon: 'profile/settings-icon',
        textKey: 'settings',
    },
    { id: 'profile', title: 'Профиль', icon: 'profile-icon', textKey: 'profile' },
]
