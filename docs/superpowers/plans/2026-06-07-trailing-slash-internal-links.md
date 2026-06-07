# Trailing-Slash Internal Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every internal link emit a trailing slash so it matches the canonical URL, eliminating the "Page with redirect" duplicates and 308 redirect hops Googlebot currently hits.

**Architecture:** The site sets `trailingSlash: true` in `next.config.js`, so the server 308-redirects `/catalog` → `/catalog/`. Canonicals and the sitemap already use the slash form, but all ~90 internal `href`s are written without a slash, so each link is a redirect hop and Google indexes the non-slash duplicate. Instead of editing 90 hrefs, we introduce a single choke point: an `AppLink` wrapper around `next/link` that normalizes internal hrefs through a pure `internalHref()` helper. We then swap the 20 `import Link from 'next/link'` statements to import `AppLink`. A guard script forbids future raw `next/link` imports outside the wrapper.

**Tech Stack:** Next.js 14 (App Router), TypeScript, React 18. Tests use the built-in `node:test` runner (Node 24, native TS type-stripping). No external test framework.

---

## File Structure

- **Create** `lib/utils/href.ts` — pure `internalHref(href)` helper. Single responsibility: normalize an internal path to its trailing-slash canonical form; leave external/file/anchor hrefs untouched.
- **Create** `lib/utils/href.test.ts` — unit tests for the helper (node:test).
- **Create** `components/ui/app-link.tsx` — `forwardRef` wrapper around `next/link` that runs string hrefs through `internalHref`. The only file allowed to import `next/link`.
- **Create** `scripts/check-internal-links.mjs` — guard: fails if any file under `app/` or `components/` (except the wrapper) imports `next/link`.
- **Modify** 20 component/page files — swap `import Link from 'next/link'` → `import Link from '@/components/ui/app-link'`. No other change; existing `<Link href=...>` usages stay as-is.

Data files (`lib/data/navigation.ts`, `seo-landings.ts`, `documents.ts`) are **not** edited — their raw paths are normalized at render time by `AppLink`. `.pdf` document hrefs and `tel:`/`mailto:`/`https:` contact hrefs are left unchanged by the helper.

---

### Task 1: `internalHref` helper

**Files:**
- Create: `lib/utils/href.ts`
- Test: `lib/utils/href.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/utils/href.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { internalHref } from './href.ts'

test('appends slash to internal path', () => {
  assert.equal(internalHref('/catalog'), '/catalog/')
  assert.equal(internalHref('/product/mramornaya-kroshka-5-10'), '/product/mramornaya-kroshka-5-10/')
})

test('leaves root and already-slashed paths unchanged', () => {
  assert.equal(internalHref('/'), '/')
  assert.equal(internalHref('/catalog/'), '/catalog/')
})

test('skips files with an extension (.pdf)', () => {
  assert.equal(internalHref('/documents/pasport-0-0-2.pdf'), '/documents/pasport-0-0-2.pdf')
})

test('skips external, mailto, tel and anchor hrefs', () => {
  assert.equal(internalHref('https://yandex.ru/maps/-/CDX'), 'https://yandex.ru/maps/-/CDX')
  assert.equal(internalHref('mailto:evoprod@mail.ru'), 'mailto:evoprod@mail.ru')
  assert.equal(internalHref('tel:+79193931992'), 'tel:+79193931992')
  assert.equal(internalHref('#section'), '#section')
  assert.equal(internalHref('//cdn.example.com/x'), '//cdn.example.com/x')
})

test('preserves query and hash', () => {
  assert.equal(internalHref('/catalog?sort=price'), '/catalog/?sort=price')
  assert.equal(internalHref('/about#team'), '/about/#team')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types lib/utils/href.test.ts`
Expected: FAIL — `Cannot find module '.../lib/utils/href.ts'` (helper not created yet).

- [ ] **Step 3: Write minimal implementation**

Create `lib/utils/href.ts`:

```ts
// Нормализует внутренний путь к канонической форме с завершающим слэшем
// (сайт работает с trailingSlash: true). Внешние ссылки, файлы и якоря не трогает.
export function internalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const splitIndex = (() => {
    const q = href.indexOf('?')
    const h = href.indexOf('#')
    if (q === -1) return h
    if (h === -1) return q
    return Math.min(q, h)
  })()

  const path = splitIndex === -1 ? href : href.slice(0, splitIndex)
  const rest = splitIndex === -1 ? '' : href.slice(splitIndex)

  if (path === '/' || path.endsWith('/')) return href
  if (/\.[a-z0-9]+$/i.test(path)) return href

  return `${path}/${rest}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test --experimental-strip-types lib/utils/href.test.ts`
Expected: PASS — all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/href.ts lib/utils/href.test.ts
git commit -m "feat(seo): add internalHref trailing-slash normalizer"
```

---

### Task 2: `AppLink` wrapper component

**Files:**
- Create: `components/ui/app-link.tsx`

- [ ] **Step 1: Write the wrapper**

Create `components/ui/app-link.tsx`:

```tsx
import Link from 'next/link'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { internalHref } from '@/lib/utils/href'

type AppLinkProps = ComponentPropsWithoutRef<typeof Link>

// Единственное место в app/ и components/, где разрешён импорт next/link.
// Прогоняет строковые href через internalHref → канонический слэш.
const AppLink = forwardRef<ElementRef<typeof Link>, AppLinkProps>(function AppLink(
  { href, ...props },
  ref,
) {
  const normalized = typeof href === 'string' ? internalHref(href) : href
  return <Link ref={ref} href={normalized} {...props} />
})

export default AppLink
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: PASS — no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/app-link.tsx
git commit -m "feat(seo): add AppLink wrapper normalizing internal hrefs"
```

---

### Task 3: Guard script forbidding raw `next/link`

**Files:**
- Create: `scripts/check-internal-links.mjs`

- [ ] **Step 1: Write the guard script**

Create `scripts/check-internal-links.mjs`:

```js
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
```

- [ ] **Step 2: Run guard to verify it FAILS now (20 offenders still present)**

Run: `node scripts/check-internal-links.mjs`
Expected: FAIL (exit 1) — lists 20 files still importing `next/link`.

- [ ] **Step 3: Commit the guard**

```bash
git add scripts/check-internal-links.mjs
git commit -m "test(seo): guard against raw next/link imports"
```

---

### Task 4: Migrate the 20 imports to `AppLink`

**Files (modify — in each, replace the single line `import Link from 'next/link'` with `import Link from '@/components/ui/app-link'`):**
- `app/about/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/catalog/page.tsx`
- `app/delivery/page.tsx`
- `app/documents/page.tsx`
- `app/primenenie/page.tsx`
- `components/layout/footer.tsx`
- `components/layout/header.tsx`
- `components/layout/logo.tsx`
- `components/layout/mobile-nav.tsx`
- `components/product-card.tsx`
- `components/sections/application-landing-page.tsx`
- `components/sections/blog-card.tsx`
- `components/sections/catalog-header.tsx`
- `components/sections/category-page-template.tsx`
- `components/sections/city-landing-page.tsx`
- `components/sections/featured-products.tsx`
- `components/sections/hero.tsx`
- `components/sections/product/product-hero.tsx`
- `components/sections/product/product-specs.tsx`

- [ ] **Step 1: Swap all 20 imports**

In every file above, find:

```tsx
import Link from 'next/link'
```

Replace with:

```tsx
import Link from '@/components/ui/app-link'
```

Leave every `<Link ...>` usage in those files exactly as it is — the wrapper is a drop-in default export.

- [ ] **Step 2: Run the guard to verify zero offenders**

Run: `node scripts/check-internal-links.mjs`
Expected: PASS — prints `OK: внутренние ссылки идут через AppLink.`

- [ ] **Step 3: Type-check**

Run: `npm run type-check`
Expected: PASS — no type errors (AppLink props match next/link).

- [ ] **Step 4: Commit**

```bash
git add app components
git commit -m "refactor(seo): route internal links through AppLink for trailing slash"
```

---

### Task 5: Build verification (rendered HTML uses trailing slash)

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `$env:NODE_OPTIONS='--max-old-space-size=4096'; npm run build`
Expected: build succeeds (51 routes), no errors.

- [ ] **Step 2: Start server and inspect rendered links**

Run (PowerShell):

```powershell
$env:NODE_OPTIONS='--max-old-space-size=4096'
Start-Process -NoNewWindow npm 'run','start'
Start-Sleep 6
$html = (Invoke-WebRequest -UseBasicParsing http://localhost:3000/).Content
# Не должно быть ссылок на /catalog без слэша; должны быть со слэшем
$bad  = ([regex]'href="/catalog"').Matches($html).Count
$good = ([regex]'href="/catalog/"').Matches($html).Count
"bad(no-slash)=$bad good(slash)=$good"
```

Expected: `bad(no-slash)=0` and `good(slash)>=1`. Stop the server afterwards (`Get-Process node | Stop-Process`).

- [ ] **Step 3: Re-run helper unit tests (regression)**

Run: `node --test --experimental-strip-types lib/utils/href.test.ts`
Expected: PASS.

- [ ] **Step 4: Final commit (if any build artifacts/notes changed — otherwise skip)**

```bash
git status --short
# обычно чисто; коммит не нужен
```

---

### Task 6: Post-deploy GSC validation (manual, after deploy)

**Files:** none (operational checklist — do after the change is live on amp-minerals.ru)

- [ ] **Step 1:** В Google Search Console → Pages → причина **"Page with redirect"** → нажать **Validate Fix**. Google перепроверит, что внутренние ссылки больше не ведут на редирект.
- [ ] **Step 2:** В **URL Inspection** проверить 2-3 не-слэш URL (например `https://amp-minerals.ru/catalog`) — должен показывать, что канон = слэш-версия, дубли уходят.
- [ ] **Step 3:** Открыть строку **"Redirect error"** в отчёте — записать конкретный URL (это отдельная проблема, не закрывается этим планом; вероятно http/www-вариант или старый адрес).

---

## Notes / Out of Scope

- **`/privacy` (footer ссылка → 404)** не входит в этот план — это отдельная задача «страница политики + cookie-информер».
- **`Crawled/Discovered – currently not indexed`** не лечится кодом — это молодость домена и тонкий контент; закрывается ростом контента и авторитета (3-дневный routine).
- **Sitemap и canonical** уже используют слэш — менять не нужно.
- Pre-existing `lib/ai/lead.test.ts` падает из-за extensionless ESM-импорта под Node 24 — это не регресс этого плана; не трогаем.
