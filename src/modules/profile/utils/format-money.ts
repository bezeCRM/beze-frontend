export function formatCompactMoney(value: number) {
    const v = Math.round(Number(value) || 0)
    const abs = Math.abs(v)

    if (abs >= 1_000_000) {
        const n = v / 1_000_000
        const s = Math.abs(n) >= 10 ? n.toFixed(0) : n.toFixed(1)
        return `${trimZeros(s)}M`
    }

    if (abs >= 1_000) {
        const n = v / 1_000
        const s = Math.abs(n) >= 10 ? n.toFixed(0) : n.toFixed(1)
        return `${trimZeros(s)}k`
    }

    return String(v)
}

function trimZeros(s: string) {
    return s.replace(/\.0$/, '')
}
