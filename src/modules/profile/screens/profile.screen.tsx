import ScreenContainer from '@/shared/components/layout/screen-container'
import { View, Text } from 'react-native'

export default function ProfileScreen() {
    // const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

    return (
        <ScreenContainer>
            <View>
                <Text>Профиль</Text>
            </View>
        </ScreenContainer>
    )
}
