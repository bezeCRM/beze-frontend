import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeMode = 'system' | 'light' | 'dark'

type ThemeState = {
    themeMode: ThemeMode
    setThemeMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            themeMode: 'system',
            setThemeMode: mode => set({ themeMode: mode }),
        }),
        {
            name: 'settings.theme',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
)
