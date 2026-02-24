import * as SecureStore from 'expo-secure-store'

const ACCESS_KEY = 'beze_access_token'
const REFRESH_KEY = 'beze_refresh_token'

export type StoredTokens = {
    accessToken: string
    refreshToken: string
}

export async function saveTokens(tokens: StoredTokens): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken)
    await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken)
}

export async function getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_KEY)
}

export async function getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_KEY)
}

export async function clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_KEY)
    await SecureStore.deleteItemAsync(REFRESH_KEY)
}
