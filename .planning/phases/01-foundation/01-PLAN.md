# Phase 01, Plan 01: Project Setup & Tooling

## Metadata
```yaml
phase: "01"
plan: "01"
wave: 1
depends_on: []
files_modified: []
autonomous: true
```

## Objective
Создать базовый Next.js проект с настроенным стеком технологий для разработки сайта zaoamp.ru.

## must_haves
```yaml
truths:
  - "Next.js 14 проект создан и запускается"
  - "TypeScript конфигурирован и проверяет типы"
  - "Tailwind CSS подключен и работает"
  - "shadcn/ui инициализирован и готов к использованию"
  - "ESLint + Prettier настроены и запускаются"
  - "Git репозиторий инициализирован с .gitignore"

artifacts:
  - path: "package.json"
    provides: "Зависимости проекта"
    min_lines: 30
  - path: "next.config.js"
    provides: "Конфигурация Next.js"
    min_lines: 10
  - path: "tsconfig.json"
    provides: "Конфигурация TypeScript"
    min_lines: 20
  - path: "tailwind.config.ts"
    provides: "Конфигурация Tailwind CSS"
    min_lines: 40
  - path: "app/layout.tsx"
    provides: "Корневой layout приложения"
    min_lines: 20
  - path: "app/page.tsx"
    provides: "Главная страница (placeholder)"
    min_lines: 10
  - path: "app/globals.css"
    provides: "Глобальные стили + Tailwind"
    min_lines: 30
  - path: "components.json"
    provides: "Конфигурация shadcn/ui"
    min_lines: 15

key_links:
  - from: "app/layout.tsx"
    to: "app/globals.css"
    via: "import styles"
  - from: "tailwind.config.ts"
    to: "app/**/*.{ts,tsx}"
    via: "content pattern"
```

## Tasks

<task type="auto">
  <name>Task 1: Initialize Next.js Project</name>
  <files>
    - package.json
    - next.config.js
    - tsconfig.json
  </files>
  <action>
    1. Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`
    2. Verify package.json includes: next, react, react-dom, typescript, tailwindcss
    3. Ensure next.config.js has `output: 'export'` for static export
  </action>
  <verify>
    - npm run build completes without errors
    - .next folder is created
  </verify>
  <done>Next.js проект инициализирован и собирается</done>
</task>

<task type="auto">
  <name>Task 2: Setup shadcn/ui</name>
  <files>
    - components.json
    - app/globals.css
    - lib/utils.ts
    - components/ui/
  </files>
  <action>
    1. Run: `npx shadcn@latest init -y --base-color stone`
    2. Verify components.json created with "baseColor": "stone"
    3. Check that lib/utils.ts has cn() utility
    4. Verify app/globals.css has Tailwind directives and CSS variables
  </action>
  <verify>
    - components.json exists and is valid JSON
    - lib/utils.ts exports cn function
    - npx shadcn add button succeeds
  </verify>
  <done>shadcn/ui инициализирован, cn() utility работает</done>
</task>

<task type="auto">
  <name>Task 3: Configure TypeScript & Tailwind</name>
  <files>
    - tsconfig.json
    - tailwind.config.ts
    - postcss.config.mjs
  </files>
  <action>
    1. Update tsconfig.json paths: `"@/*": ["./*"]`
    2. Configure tailwind.config.ts:
       - content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"]
       - Add custom colors for marble theme
       - Add fontFamily configuration
    3. Verify postcss.config.mjs exists
  </action>
  <verify>
    - npx tsc --noEmit passes
    - Tailwind classes work in test component
  </verify>
  <done>TS и Tailwind полностью сконфигурированы</done>
</task>

<task type="auto">
  <name>Task 4: Setup Project Structure</name>
  <files>
    - app/layout.tsx
    - app/page.tsx
    - app/globals.css
    - components/
    - lib/
    - types/
    - public/images/
    - public/fonts/
  </files>
  <action>
    1. Create directory structure:
       - components/ — React компоненты
       - components/ui/ — shadcn компоненты
       - components/layout/ — Layout компоненты
       - lib/ — Утилиты, хелперы
       - lib/data/ — Данные (продукты, контент)
       - types/ — TypeScript типы
       - public/images/ — Изображения
       - public/fonts/ — Шрифты
    2. Update app/layout.tsx with basic HTML structure
    3. Update app/page.tsx with placeholder content
  </action>
  <verify>
    - npm run dev запускается на localhost:3000
    - Страница отображается без ошибок
  </verify>
  <done>Структура проекта создана, dev-сервер работает</done>
</task>

<task type="auto">
  <name>Task 5: Add Essential Dependencies</name>
  <files>
    - package.json
  </files>
  <action>
    1. Install utilities:
       - `npm install framer-motion lucide-react clsx tailwind-merge`
    2. Install form handling:
       - `npm install react-hook-form @hookform/resolvers zod`
    3. Install maps (for contacts page):
       - `npm install react-leaflet leaflet @types/leaflet`
    4. Verify all packages in package.json dependencies
  </action>
  <verify>
    - npm list framer-motion lucide-react react-hook-form zod
    - All packages installed without peer dependency warnings
  </verify>
  <done>Все необходимые зависимости установлены</done>
</task>

## Verification Criteria

1. **Проект собирается:** `npm run build` завершается успешно
2. **Dev-сервер работает:** `npm run dev` доступен на localhost:3000
3. **TypeScript проверяет:** `npx tsc --noEmit` без ошибок
4. **shadcn/ui готов:** `npx shadcn add button` успешно добавляет компонент
5. **Структура создана:** Все директории из Task 4 существуют

## Success Criteria
- [ ] Next.js 14 проект создан и работает
- [ ] TypeScript строго проверяет типы
- [ ] Tailwind CSS подключен и стили применяются
- [ ] shadcn/ui инициализирован с темой stone
- [ ] Все зависимости установлены
- [ ] Структура директорий создана
