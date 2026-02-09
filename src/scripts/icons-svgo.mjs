import { optimize } from 'svgo'
import fs from 'node:fs'
import path from 'node:path'

const ICONS_DIR = path.resolve(process.cwd(), 'src/assets/icons')

const only = new Set([
    'plus-icon.svg',
    'x-icon.svg',
    'search-icon.svg',
    'arrow-icon.svg',
    'planner-icon.svg',
    'orders-icon.svg',
    'products-icon.svg',
    'profile-icon.svg',
])

const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'))

let processed = 0

for (const filename of files) {
    if (!only.has(filename)) continue

    const fullPath = path.join(ICONS_DIR, filename)
    const input = fs.readFileSync(fullPath, 'utf8')

    const result = optimize(input, {
        multipass: true,
        plugins: [
            'preset-default',
            {
                name: 'convertColors',
                params: { currentColor: true },
            },
            {
                // принудительно ставим currentColor на root, чтобы было проще красить
                name: 'addAttributesToSVGElement',
                params: {
                    attributes: [{ fill: 'currentColor' }, { stroke: 'currentColor' }],
                },
            },
            {
                // убираем фиксированные fill/stroke, которые мешают перекраске
                name: 'removeAttrs',
                params: {
                    attrs: ['(fill|stroke)=(?!\"none\").*', 'style'],
                },
            },
        ],
    })

    fs.writeFileSync(fullPath, result.data, 'utf8')
    processed += 1
}

console.log(`normalized ${processed}/${files.length} svg icons`)
