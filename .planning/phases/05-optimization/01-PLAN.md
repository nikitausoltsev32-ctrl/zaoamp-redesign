# Phase 05, Plan 01: Performance Optimization

## Metadata
```yaml
phase: "05"
plan: "01"
wave: 5
depends_on: ["04-03"]
files_modified:
  - next.config.js
  - app/layout.tsx
  - components/
autonomous: true
```

## Objective
Оптимизировать производительность сайта для Core Web Vitals (зелёная зона): LCP < 2.5s, FID < 100ms, CLS < 0.1.

## must_haves
```yaml
truths:
  - "Core Web Vitals в зелёной зоне"
  - "Изображения оптимизированы (next/image)"
  - "Шрифты оптимизированы (next/font)"
  - "JavaScript бандлы разделены"
  - "Статический экспорт настроен"

artifacts:
  - path: "next.config.js"
    provides: "Оптимизированная конфигурация"
    min_lines: 30
  - path: "app/layout.tsx"
    provides: "Оптимизированный layout"
    min_lines: 50
  - path: "components/image.tsx"
    provides: "Обертка для next/image"
    min_lines: 25

key_links:
  - from: "app/layout.tsx"
    to: "next/font/google"
    via: "import { Inter }"
  - from: "components/product-card.tsx"
    to: "components/image.tsx"
    via: "import { OptimizedImage }"
```

## Tasks

<task type="auto">
  <name>Task 1: Configure Next.js for Performance</name>
  <files>
    - next.config.js
  </files>
  <action>
    1. Update next.config.js:
       - output: 'export'
       - distDir: 'dist'
       - images: { unoptimized: true } (for static export)
       - compress: true
       - poweredByHeader: false
       - reactStrictMode: true
       - swcMinify: true
       - experimental: { optimizeCss: true }
    2. Verify build succeeds
  </action>
  <verify>
    - npm run build succeeds
    - Static files generated in dist/
    - No console errors
  </verify>
  <done>Next.js настроен для оптимизации</done>
</task>

<task type="auto">
  <name>Task 2: Optimize Images</name>
  <files>
    - components/ui/image.tsx
    - Update all image usages
  </files>
  <action>
    1. Create components/ui/image.tsx wrapper:
       - Use next/image
       - Add priority for above-fold images
       - Add placeholder="blur" where applicable
       - Proper sizing (width, height or fill)
    2. Update all image components:
       - ProductCard images
       - Hero images
       - About page images
    3. Optimize image formats:
       - Use WebP where possible
       - Proper sizes for responsive
  </action>
  <verify>
    - Images load with next/image
    - No layout shift
    - Proper lazy loading
  </verify>
  <done>Изображения оптимизированы</done>
</task>

<task type="auto">
  <name>Task 3: Optimize Fonts</name>
  <files>
    - app/layout.tsx
  </files>
  <action>
    1. Ensure next/font usage:
       - Import from next/font/google
       - Use subsets: ['latin', 'cyrillic']
       - Display: 'swap'
       - Preload: true for critical fonts
    2. Update layout.tsx:
       - Inter for UI
       - Merriweather for headings
       - Proper CSS variable injection
    3. Verify no font flash (FOUT)
  </action>
  <verify>
    - Fonts loaded via next/font
    - No external Google Fonts requests
    - Cyrillic subset included
  </verify>
  <done>Шрифты оптимизированы</done>
</task>

<task type="auto">
  <name>Task 4: Code Splitting & Lazy Loading</name>
  <files>
    - components/sections/
    - app/page.tsx
  </files>
  <action>
    1. Implement lazy loading:
       - dynamic() for below-fold sections
       - lazy load Map component
       - lazy load Calculator on mobile
    2. Split heavy components:
       - ReactLeaflet (动态 import)
       - Framer Motion sections
    3. Add Suspense boundaries with fallback
  </action>
  <verify>
    - Below-fold content loads lazily
    - Suspense fallbacks visible
    - Reduced initial bundle size
  </verify>
  <done>Ленивая загрузка настроена</done>
</task>

<task type="auto">
  <name>Task 5: Optimize CSS</name>
  <files>
    - app/globals.css
    - tailwind.config.ts
  </files>
  <action>
    1. CSS optimizations:
       - Remove unused Tailwind classes (purge)
       - Use Tailwind CSS layers properly
       - Minimize custom CSS
    2. Critical CSS:
       - Inline critical styles
       - Defer non-critical CSS
    3. Verify Tailwind purge:
       - content array correct
       - safelist if needed
  </action>
  <verify>
    - CSS bundle size reasonable
    - No unused styles
    - Proper layer ordering
  </verify>
  <done>CSS оптимизирован</done>
</task>

## Verification Criteria

1. **Core Web Vitals:**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
2. **Build:** Static export succeeds
3. **Images:** next/image, proper sizing
4. **Fonts:** next/font, no flash
5. **Lazy loading:** Below-fold deferred
6. **CSS:** Minimized, critical inlined

## Success Criteria
- [ ] next.config.js оптимизирован
- [ ] Изображения с next/image
- [ ] Шрифты через next/font
- [ ] Lazy loading для тяжёлых компонентов
- [ ] CSS оптимизирован
- [ ] Зелёная зона CWV
