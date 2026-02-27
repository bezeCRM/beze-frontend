export default function makeLocalId(prefix: string) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`
}

export function sanitizeRubInt(text: string): string {
    const t = String(text ?? '').trim()
    const cut = t.split(/[.,]/)[0]
    const digits = cut.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '')
    return digits
}

export function parseRubInt(text: number | string): number {
    const raw = String(text ?? '')
    const sanitized = sanitizeRubInt(raw) // "8 000" -> "8000"
    const n = Number(sanitized)
    return Number.isFinite(n) ? Math.max(0, n) : 0
}

export function cutOrderId(id: string | number): string {
    const s = String(id)
    return s.length > 8 ? `${s.slice(0, 8)}` : s
}
