export function normalizeText(input: string): string {
    return input.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim()
}
