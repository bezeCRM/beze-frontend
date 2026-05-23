import { useMemo, useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'

import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

import { LEGAL_LINKS } from '@/shared/utils/legal-links'

export type GuestStartModalProps = BaseModalProps & {
    onStart: (
        termsAccepted: boolean,
        personalDataAccepted: boolean,
    ) => void | Promise<void>
    onCancel?: () => void
    startText?: string
    cancelText?: string
}

export default function GuestStartModal({
    onStart,
    onCancel,
    startText = 'Начать',
    cancelText = 'Отмена',
    onClose,
}: GuestStartModalProps) {
    const styles = useStyles()

    const [termsAccepted, setTermsAccepted] = useState(false)
    const [personalDataAccepted, setPersonalDataAccepted] = useState(false)

    const canStart = useMemo(() => {
        return termsAccepted && personalDataAccepted
    }, [termsAccepted, personalDataAccepted])

    const openLegalLink = (url: string): void => {
        void Linking.openURL(url)
    }

    const handleStart = async (): Promise<void> => {
        if (!canStart) return
        await onStart(termsAccepted, personalDataAccepted)
    }

    return (
        <View style={styles.container}>
            <ModalHeader title="Попробовать без регистрации" onClose={onClose} />

            <Text style={styles.text}>
                Мы создадим временный аккаунт без привязки email. Если вы выйдете из
                аккаунта, удалите приложение или смените устройство, доступ к данным может
                быть потерян.
            </Text>

            <View style={styles.checkboxes}>
                <LegalCheckbox
                    checked={termsAccepted}
                    onPress={() => setTermsAccepted(prev => !prev)}
                >
                    <Text style={styles.checkboxText}>
                        Я принимаю{' '}
                        <Text
                            style={styles.link}
                            onPress={() => openLegalLink(LEGAL_LINKS.terms)}
                        >
                            Пользовательское соглашение bezeCRM
                        </Text>
                    </Text>
                </LegalCheckbox>

                <LegalCheckbox
                    checked={personalDataAccepted}
                    onPress={() => setPersonalDataAccepted(prev => !prev)}
                >
                    <Text style={styles.checkboxText}>
                        Я ознакомлен(а) с{' '}
                        <Text
                            style={styles.link}
                            onPress={() => openLegalLink(LEGAL_LINKS.privacy)}
                        >
                            Политикой обработки персональных данных bezeCRM
                        </Text>{' '}
                        и даю{' '}
                        <Text
                            style={styles.link}
                            onPress={() => openLegalLink(LEGAL_LINKS.consent)}
                        >
                            согласие на обработку моих персональных данных
                        </Text>
                    </Text>
                </LegalCheckbox>
            </View>

            <ModalFooter
                primaryTitle={startText}
                secondaryTitle={cancelText}
                onPrimaryPress={handleStart}
                onSecondaryPress={onCancel || onClose}
                primaryDisabled={!canStart}
            />
        </View>
    )
}

type LegalCheckboxProps = {
    checked: boolean
    onPress: () => void
    children: React.ReactNode
}

function LegalCheckbox({ checked, onPress, children }: LegalCheckboxProps) {
    const styles = useStyles()

    return (
        <Pressable style={styles.checkboxRow} onPress={onPress}>
            <View style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
                {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>

            <View style={styles.checkboxTextContainer}>{children}</View>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            paddingBottom: 18,
        },
        text: {
            fontSize: 15,
            paddingHorizontal: 32,
            textAlign: 'center',
            color: theme.colors.text,
            fontFamily: 'Epilogue-Semibold',
            lineHeight: 20,
            marginBottom: 22,
        },
        checkboxes: {
            paddingHorizontal: 28,
            gap: 14,
            marginBottom: 24,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor: theme.colors.textMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
        },
        checkboxChecked: {
            borderColor: theme.colors.brand,
            backgroundColor: theme.colors.brand,
        },
        checkboxMark: {
            fontFamily: 'Epilogue-Bold',
            color: theme.colors.background,
            fontSize: 13,
            lineHeight: 16,
        },
        checkboxTextContainer: {
            flex: 1,
        },
        checkboxText: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.textMuted,
            fontSize: 12,
            lineHeight: 17,
        },
        link: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.brand,
            fontSize: 12,
            lineHeight: 17,
            textDecorationLine: 'underline',
        },
    }),
)
