import { useMemo } from 'react'
import { useTheme } from './useTheme'
import type { Theme } from './theme'

export const createThemedStyles = <T>(factory: (theme: Theme) => T) => {
    let lightCache: T | null = null
    let darkCache: T | null = null

    return () => {
        const { theme } = useTheme()

        return useMemo(() => {
            if (theme.scheme === 'dark') {
                if (!darkCache) darkCache = factory(theme)
                return darkCache
            }

            if (!lightCache) lightCache = factory(theme)
            return lightCache
        }, [theme])
    }
}
