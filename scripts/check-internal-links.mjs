import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

// Все .tsx под app/ и components/, кроме самого враппера
const WRAPPER = 'components/ui/app-link.tsx'
const files = execSync('git ls-files app components', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.endsWith('.tsx') && f !== WRAPPER)

const offenders = files.filter((f) => /from ['"]next\/link['"]/.test(readFileSync(f, 'utf8')))

if (offenders.length) {
  console.error('Прямой импорт next/link запрещён — используйте @/components/ui/app-link:')
  for (const f of offenders) console.error('  ' + f)
  process.exit(1)
}
console.log('OK: внутренние ссылки идут через AppLink.')
