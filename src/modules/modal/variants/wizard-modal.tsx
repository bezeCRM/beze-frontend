import { ReactNode, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'

type Step = {
    id: string
    content: ReactNode
    title: string
    buttonTitle: string
}

export type WizardModalProps = BaseModalProps & {
    steps: Step[]
    onComplete: () => void
}

export default function WizardModal({ steps, onComplete, onClose }: WizardModalProps) {
    const [current, setCurrent] = useState(0)
    const step = steps[current]

    const next = () => {
        if (current < steps.length - 1) setCurrent(current + 1)
        else onComplete()
    }

    return (
        <View style={styles.container}>
            <ModalHeader title={step.title} onClose={onClose} />
            <View style={styles.body}>{step.content}</View>
            <ModalFooter primaryTitle={step.buttonTitle} onPrimaryPress={next} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingBottom: 10 },
    body: { minHeight: 120, justifyContent: 'center' },
})
