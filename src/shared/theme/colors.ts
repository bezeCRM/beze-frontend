export type Colors = {
  brand: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
  info: string
  success: string
  danger: string
  warning: string
  fixedWhite: string
}

export const lightColors: Colors = {
  brand: '#FF8EB1',
  background: '#F8F6F6',
  surface: '#FFFFFF',
  text: '#020202',
  textMuted: '#A6A6A6',
  border: '#E9E9E9',
  info: '#879FFF',
  success: '#53BD5A',
  danger: '#FF6B6B',
  warning: '#FFAE52',
  fixedWhite: '#FFFFFF',
}

export const darkColors: Colors = {
  brand: '#FF8EB1',
  background: '#0B0B0D',
  surface: '#202027',
  text: '#F5F5F6',
  textMuted: '#A1A1A8',
  border: '#313131',
  info: '#748fff',
  success: '#53BD5A',
  danger: '#FF6B6B',
  warning: '#FFAE52',
  fixedWhite: '#FFFFFF',
}

export type ThemeScheme = 'light' | 'dark'
