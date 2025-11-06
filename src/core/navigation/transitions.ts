import type { StackCardStyleInterpolator } from '@react-navigation/stack'

export const layeredSlideFromRight: StackCardStyleInterpolator = ({
    current,
    next,
    layouts,
}) => {
    // когда экран активный и на него пушат новый — next существует для предыдущего экрана
    const shiftLeft = next
        ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -30], // прошлый экран слегка уезжает влево
          })
        : 0

    // когда экран только что открыт — он заезжает справа
    const slideIn = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
    })

    return {
        cardStyle: {
            transform: [{ translateX: next ? shiftLeft : slideIn }],
        },
        overlayStyle: {
            // лёгкая затемняющая подложка для глубины
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.08],
            }),
        },
    }
}
