import { optimize } from 'svgo'
import fs from 'node:fs'
import path from 'node:path'

const ICONS_DIR = path.resolve(process.cwd(), 'src/assets/icons')

const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'))

for (const file of files) {
    const fullPath = path.join(ICONS_DIR, file)
    const input = fs.readFileSync(fullPath, 'utf8')

    if (
        !(
            file.name === 'plus-icon.svg' ||
            file.name === 'x-icon.svg' ||
            file.name === 'search-icon.svg' ||
            file.name === 'arrow-icon.svg'
        )
    ) {
        continue
    }

    const result = optimize(input, {
        multipass: true,
        plugins: [
            'preset-default',
            {
                name: 'convertColors',
                params: { currentColor: true },
            },
        ],
    })

    fs.writeFileSync(fullPath, result.data, 'utf8')
}

console.log(`optimized ${files.length} svg icons`)
