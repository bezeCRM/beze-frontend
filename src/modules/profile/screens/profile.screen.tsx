import { RootTabParamList } from '@/core/navigation/root-navigation'
import { RootStackParamList } from '@/core/navigation/types'
import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import ProfileHeader from '../components/profile/profile-header'
import ProfileUserInfo from '../components/profile/profile-user-info'
import { Items } from '../utils/profile-list-items'
import ProfileListItem from '../components/profile/profile-list-item'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

// навигация
type ProfileNav = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackParamList>
>

function useProfileNav() {
    return useNavigation<ProfileNav>()
}

export default function ProfileScreen() {
    const styles = useStyles()
    const navigation = useProfileNav()

    const ProfileNavFunctions: (() => void)[] = [
        () => navigation.navigate('Orders'),
        () => navigation.navigate('Products'),
        () => navigation.navigate('Planner'),
        () => navigation.navigate('Finances'),
        () => navigation.navigate('Settings'),
        () => navigation.navigate('Help'),
    ]

    return (
        <ScreenContainer>
            <MainHeader />
            <ProfileHeader />
            <ProfileUserInfo
                name={'Мегадлинное имя и фамилия'}
                nick={'alsolongnickwithdickandsuckingcockallday'}
            />
            <View style={styles.list}>
                {Items.map(item => (
                    <ProfileListItem
                        key={item.id}
                        icon={item.icon}
                        title={item.name}
                        arrow={item.arrow}
                        nav={ProfileNavFunctions[Number(item.id) - 1]}
                    />
                ))}
            </View>
            <Pressable>
                <Text style={styles.leave}>Выйти</Text>
            </Pressable>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        list: {
            rowGap: 7,
            marginBottom: 30,
        },
        leave: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.danger,
            fontSize: 16,
            textAlign: 'center',
        },
    }),
)
