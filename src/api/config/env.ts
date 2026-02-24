import Constants from 'expo-constants'

function getDevHostFromExpo(): string | null {
    const hostUri = Constants.expoConfig?.hostUri
    if (!hostUri) return null

    const host = hostUri.split(':')[0]
    return host || null
}

const devHost = getDevHostFromExpo()

export const ENV = {
    apiBaseUrl: 'http://192.168.0.107:8000/api/v1',
    // __DEV__ && devHost
    //   ? `http://${devHost}:8000/api/v1`
    //   : "http://127.0.0.1:8000/api/v1",
    requestTimeoutMs: 15000,
}
