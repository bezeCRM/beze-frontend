import { create } from 'zustand'
import { ReactNode } from 'react'
import { ConfirmModalProps } from '../variants/confirm-modal'
import { FormModalProps } from '../variants/form-modal'
import { StatusModalProps } from '../variants/status-modal'
import { ListSelectModalProps } from '../variants/list-select-modal'
import { ChipSelectModalProps } from '../variants/chip-select-modal'
import { WizardModalProps } from '../variants/wizard-modal'
import { PlannerTaskModalProps } from '../variants/planner-task-modal'

export type ModalPropsMap = {
    confirm: ConfirmModalProps
    form: FormModalProps
    status: StatusModalProps
    'list-select': ListSelectModalProps
    'chip-select': ChipSelectModalProps
    wizard: WizardModalProps
    plannerTask: PlannerTaskModalProps
}

export type ModalType = keyof ModalPropsMap

type ModalState = {
    type: ModalType | null
    visible: boolean
    props?: ModalPropsMap[ModalType]
    content?: ReactNode
    open: <T extends ModalType>(type: T, props: ModalPropsMap[T]) => void
    openCustom: (content: ReactNode) => void
    update: (props: Record<string, any>) => void
    close: () => void
    reset: () => void
}

export const useModalStore = create<ModalState>(set => ({
    type: null,
    visible: false,
    props: undefined,
    content: undefined,

    open: (type, props) => set({ type, props, content: undefined, visible: true }),
    openCustom: content => set({ content, type: null, props: undefined, visible: true }),
    update: props =>
        set(state => ({
            props: { ...(state.props as any), ...props } as any,
        })),
    close: () => set({ visible: false }),
    reset: () =>
        set({ type: null, visible: false, props: undefined, content: undefined }),
}))
