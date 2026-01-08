export function parseMoneyRu(text: string) {
    const n = Number(
        String(text ?? '')
            .replace(/\s/g, '')
            .replace(',', '.'),
    )
    return Number.isFinite(n) ? n : 0
}

export function formatMoneyRu(value: number) {
    const n = Math.round(Number(value) || 0)
    return n.toLocaleString('ru-RU')
}
