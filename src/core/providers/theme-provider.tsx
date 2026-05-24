import React, { createContext, useMemo } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { createTheme, type Theme } from '@/shared/theme/theme'
import { useThemeStore, type ThemeMode } from '@/shared/theme/theme.store'
import type { ThemeScheme } from '@/shared/theme/colors'

type ThemeContextValue = {
    theme: Theme
    themeMode: ThemeMode
    setThemeMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const resolveScheme = (
    mode: ThemeMode,
    system: string | null | undefined,
): ThemeScheme => {
    if (mode === 'light') return 'light'
    if (mode === 'dark') return 'dark'
    return system === 'dark' ? 'dark' : 'light'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const systemScheme = useColorScheme()
    const themeMode = useThemeStore(s => s.themeMode)
    const setThemeMode = useThemeStore(s => s.setThemeMode)

    const scheme = resolveScheme(themeMode, systemScheme)
    const theme = useMemo(() => createTheme(scheme), [scheme])

    const value = useMemo(
        () => ({ theme, themeMode, setThemeMode }),
        [theme, themeMode, setThemeMode],
    )

    return (
        <ThemeContext.Provider value={value}>
            <StatusBar
                barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
                backgroundColor={theme.colors.background}
            />
            {children}
        </ThemeContext.Provider>
    )
}
