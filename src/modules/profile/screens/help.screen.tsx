import { Nav } from '@/core/navigation/types'
import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, ScrollView } from 'react-native'
import { HELP_TEXT } from '../utils/help-text'
import { HelpSectionCard } from '../components/help/help-section-card'
import { HELP_SECTIONS } from '../utils/help-section'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HelpScreen() {
    const styles = useStyles()
    const navigation = useNavigation<Nav>()
    const { bottom } = useSafeAreaInsets()
    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar onBack={() => navigation.goBack()} />
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: bottom + 20 }}
                >
                    <View style={styles.titleWrap}>
                        <InternalHeaderTitle title="Справка" />
                    </View>
                    <View style={styles.list}>
                        {HELP_SECTIONS.map(s => (
                            <HelpSectionCard
                                key={s.id}
                                title={s.title}
                                icon={s.icon}
                                text={HELP_TEXT[s.textKey]}
                                pinkBackground={s.textKey === 'contact'}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        stickyTopBar: { backgroundColor: theme.colors.background },
        scroll: { flex: 1 },
        titleWrap: {},
        list: {
            rowGap: 15,
            marginTop: -8,
        },
    }),
)
