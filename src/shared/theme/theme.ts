import type { Colors, ThemeScheme } from './colors'
import { darkColors, lightColors } from './colors'

export type Theme = {
    scheme: ThemeScheme
    colors: Colors
}

export const createTheme = (scheme: ThemeScheme): Theme => {
    return {
        scheme,
        colors: scheme === 'dark' ? darkColors : lightColors,
    }
}
