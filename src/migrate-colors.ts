// src/migrate-colors.ts
// run: npx ts-node src/migrate-colors.ts
// run with preview only: npx ts-node src/migrate-colors.ts --dry
// run with backups: npx ts-node src/migrate-colors.ts --backup

import * as fs from 'fs'
import * as path from 'path'

type Options = {
    dry: boolean
    backup: boolean
}

const args = process.argv.slice(2)
const opts: Options = {
    dry: args.includes('--dry') || args.includes('--dry-run'),
    backup: args.includes('--backup'),
}

const ROOT = path.resolve(process.cwd(), 'src')

const exts = new Set(['.ts', '.tsx', '.js', '.jsx'])

// mapping old key to new key
const COLOR_KEY_MAP: Record<string, string> = {
    mainPink: 'brand',
    backgroundWhite: 'background',
    mainWhite: 'surface',
    mainBlack: 'text',
    mainGray: 'textMuted',
    lineGray: 'border',
    mainBlue: 'info',
    successGreen: 'success',
    errorRed: 'danger',
    inworkYellow: 'warning',
}

// patterns to migrate
// - theme.colors.brand         -> theme.colors.brand
// - theme.theme.colors.brand   -> theme.colors.brand
// - theme.colors.colors...  won't happen but avoid over-matching
const buildReplacements = () => {
    const entries = Object.entries(COLOR_KEY_MAP)
    const reps: { re: RegExp; to: string }[] = []

    for (const [oldKey, newKey] of entries) {
        // colors.oldKey
        reps.push({
            re: new RegExp(`\\bcolors\\.${oldKey}\\b`, 'g'),
            to: `theme.colors.${newKey}`,
        })

        // theme.colors.oldKey
        reps.push({
            re: new RegExp(`\\btheme\\.colors\\.${oldKey}\\b`, 'g'),
            to: `theme.colors.${newKey}`,
        })
    }

    return reps
}

const REPLACEMENTS = buildReplacements()

const shouldSkipDir = (dirName: string) => {
    return (
        dirName === 'node_modules' ||
        dirName === '.git' ||
        dirName === 'dist' ||
        dirName === 'build' ||
        dirName === '.expo' ||
        dirName === '.next' ||
        dirName === 'coverage'
    )
}

const walk = (dir: string, out: string[] = []) => {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const item of items) {
        const full = path.join(dir, item.name)
        if (item.isDirectory()) {
            if (!shouldSkipDir(item.name)) walk(full, out)
            continue
        }

        const ext = path.extname(item.name)
        if (exts.has(ext)) out.push(full)
    }
    return out
}

const ensureBackup = (filePath: string, original: string) => {
    const backupPath = `${filePath}.bak`
    if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, original, 'utf8')
    }
}

const run = () => {
    const files = walk(ROOT)
    let touched = 0
    let totalRepls = 0

    for (const file of files) {
        const original = fs.readFileSync(file, 'utf8')
        let text = original
        let changed = false

        // count replacements per file by running each regexp and summing matches
        let fileRepls = 0
        for (const { re, to } of REPLACEMENTS) {
            const matches = text.match(re)
            if (matches?.length) {
                fileRepls += matches.length
                text = text.replace(re, to)
                changed = true
            }
        }

        if (!changed) continue

        touched += 1
        totalRepls += fileRepls

        const rel = path.relative(process.cwd(), file)
        if (opts.dry) {
            console.log(`[dry] ${rel}  (${fileRepls} replacements)`)
            continue
        }

        if (opts.backup) ensureBackup(file, original)
        fs.writeFileSync(file, text, 'utf8')
        console.log(`[ok] ${rel}  (${fileRepls} replacements)`)
    }

    console.log(
        `done. files changed: ${touched}, total replacements: ${totalRepls}, mode: ${opts.dry ? 'dry' : 'write'}`,
    )
}

run()
