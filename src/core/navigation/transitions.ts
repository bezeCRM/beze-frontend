import type { StackCardStyleInterpolator } from '@react-navigation/stack'

export const layeredSlideFromRight: StackCardStyleInterpolator = ({
    current,
    next,
    layouts,
}) => {
    const shiftLeft = next
        ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -40], // прошлый экран слегка уезжает влево
          })
        : 0

    const slideIn = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
    })

    return {
        cardStyle: {
            transform: [{ translateX: next ? shiftLeft : slideIn }],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.08],
            }),
        },
    }
}
