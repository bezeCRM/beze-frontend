import {
    useModalStore,
    ModalType,
    ModalPropsMap,
} from '@/modules/modal/store/modal.store'
import { ReactNode } from 'react'

export function useModal() {
    const { open, openCustom, update, close } = useModalStore()

    const openModal = <T extends ModalType>(type: T, props: ModalPropsMap[T]) => {
        open(type, props)
    }

    const openCustomModal = (content: ReactNode) => openCustom(content)

    const updateModal = (props: Record<string, any>) => update(props)

    const closeModal = () => close()

    return {
        open: openModal,
        openCustom: openCustomModal,
        update: updateModal,
        close: closeModal,
    }
}
