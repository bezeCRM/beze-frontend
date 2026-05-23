import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import BaseModal from '@/modules/modal/base/base-modal'
import { useModalStore } from '@/modules/modal/store/modal.store'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'
import FormModal from '@/modules/modal/variants/form-modal'
import StatusModal from '@/modules/modal/variants/status-modal'
import ListSelectModal from '@/modules/modal/variants/list-select-modal'
import ChipSelectModal from '@/modules/modal/variants/chip-select-modal'
import WizardModal from '@/modules/modal/variants/wizard-modal'
import PlannerTaskModal from '@/modules/modal/variants/planner-task-modal'
import GuestStartModal from '@/modules/modal/variants/guest-start-modal'

export function ModalProvider() {
    const { type, visible, props, content, close, reset } = useModalStore()

    useEffect(() => {
        if (!visible) {
            const timer = setTimeout(reset, 200)
            return () => clearTimeout(timer)
        }
    }, [reset, visible])

    const renderContent = () => {
        if (content) return content

        switch (type) {
            case 'confirm':
                return <ConfirmModal {...(props as any)} onClose={close} />
            case 'form':
                return <FormModal {...(props as any)} onClose={close} />
            case 'status':
                return <StatusModal {...(props as any)} onClose={close} />
            case 'list-select':
                return <ListSelectModal {...(props as any)} onClose={close} />
            case 'chip-select':
                return <ChipSelectModal {...(props as any)} onClose={close} />
            case 'wizard':
                return <WizardModal {...(props as any)} onClose={close} />
            case 'plannerTask':
                return <PlannerTaskModal {...(props as any)} onClose={close} />
            case 'guestStart':
                return <GuestStartModal {...(props as any)} onClose={close} />
            default:
                return null
        }
    }

    const blocking = !!(props as any)?.blocking

    return (
        <View style={StyleSheet.absoluteFill}>
            <BaseModal visible={visible} onClose={close} dismissOnBackdrop={!blocking}>
                {renderContent()}
            </BaseModal>
        </View>
    )
}
