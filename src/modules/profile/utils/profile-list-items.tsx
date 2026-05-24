import { IconName } from '@/shared/ui/icon/icon'

export type ProfileListItemType = {
    id: string
    icon: IconName
    name: string
    arrow: boolean
}

export const Items: ProfileListItemType[] = [
    {
        id: '1',
        icon: 'profile/orders-icon',
        name: 'Заказы',
        arrow: false,
    },
    {
        id: '2',
        icon: 'profile/products-icon',
        name: 'Товары',
        arrow: false,
    },
    {
        id: '3',
        icon: 'profile/planner-icon',
        name: 'Планер',
        arrow: false,
    },
    {
        id: '4',
        icon: 'profile/finances-icon',
        name: 'Финансы',
        arrow: true,
    },
    {
        id: '5',
        icon: 'profile/settings-icon',
        name: 'Настройки',
        arrow: true,
    },
    {
        id: '6',
        icon: 'profile/help-icon',
        name: 'Справка',
        arrow: true,
    },
    {
        id: '7',
        icon: 'profile/docs-icon',
        name: 'Документы',
        arrow: false,
    },
]
