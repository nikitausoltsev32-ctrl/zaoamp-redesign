# Phase 02, Plan 01: Theme & Colors

## Metadata
```yaml
phase: "02"
plan: "01"
wave: 1
depends_on: ["01-01"]
files_modified:
  - tailwind.config.ts
  - app/globals.css
  - components.json
autonomous: true
```

## Objective
Настроить цветовую схему и тему для сайта мраморной крошки: белый мрамор, промышленные серые тона, оранжевые акценты для CTA.

## must_haves
```yaml
truths:
  - "Цветовая палитра соответствует бренду (белый мрамор)"
  - "CSS переменные настроены для светлой темы"
  - "Кастомные цвета доступны через Tailwind классы"
  - "Контрастность соответствует WCAG AA"
  - "Переменные shadcn/ui переопределены"

artifacts:
  - path: "tailwind.config.ts"
    provides: "Кастомные цвета и тема Tailwind"
    min_lines: 60
  - path: "app/globals.css"
    provides: "CSS переменные и базовые стили"
    min_lines: 80
  - path: "components/theme-provider.tsx"
    provides: "Provider для темы"
    min_lines: 10

key_links:
  - from: "tailwind.config.ts"
    to: "app/globals.css"
    via: "CSS variables reference"
  - from: "app/layout.tsx"
    to: "components/theme-provider.tsx"
    via: "ThemeProvider wrapper"
```

## Tasks

<task type="auto">
  <name>Task 1: Define Color Palette</name>
  <files>
    - tailwind.config.ts
    - app/globals.css
  </files>
  <action>
    1. Define color palette for marble company:
       - Primary: Stone palette (warm grays)
       - Accent: Orange/Gold (#F97316 or #D97706)
       - Marble: Pure white (#FFFFFF) and off-white (#FAFAF9)
       - Text: Dark slate (#1C1917, #44403C)
       - Background: Warm gray (#FAFAF9)
    2. Update tailwind.config.ts theme.extend.colors:
       - marble: { white: '#FFFFFF', offwhite: '#FAFAF9', cream: '#F5F5F4' }
       - accent: { orange: '#F97316', gold: '#D97706', amber: '#F59E0B' }
       - industrial: { slate: '#64748B', steel: '#94A3B8' }
    3. Update app/globals.css with CSS variables matching palette
  </action>
  <verify>
    - Colors defined in tailwind.config.ts
    - CSS variables set in :root
    - Test: <div className="bg-marble-white"> works
  </verify>
  <done>Цветовая палитра определена и доступна в Tailwind</done>
</task>

<task type="auto">
  <name>Task 2: Configure shadcn/ui Theme Variables</name>
  <files>
    - app/globals.css
    - components.json
  </files>
  <action>
    1. Update CSS variables in app/globals.css for shadcn:
       - --background: 0 0% 98% (stone-50)
       - --foreground: 20 14% 10% (stone-900)
       - --primary: 24 10% 10% (stone-800)
       - --primary-foreground: 60 9% 98%
       - --accent: 24 95% 53% (orange-500)
       - --accent-foreground: 60 9% 98%
       - --muted: 20 6% 90%
       - --muted-foreground: 20 6% 40%
       - --border: 20 6% 85%
       - --input: 20 6% 85%
       - --ring: 24 95% 53%
    2. Update border-radius in globals.css (modern feel):
       - --radius: 0.5rem
  </action>
  <verify>
    - CSS variables match shadcn requirements
    - Button component renders with correct colors
  </verify>
  <done>Переменные shadcn/ui настроены под бренд</done>
</task>

<task type="auto">
  <name>Task 3: Add Typography Configuration</name>
  <files>
    - tailwind.config.ts
    - app/layout.tsx
    - app/globals.css
  </files>
  <action>
    1. Configure fonts in tailwind.config.ts:
       - sans: ['Inter', 'system-ui', 'sans-serif'] (UI text)
       - serif: ['Merriweather', 'Georgia', 'serif'] (headings - premium feel)
       - display: ['Inter', 'sans-serif'] (large headings)
    2. Add Google Fonts import to layout.tsx:
       - Import Inter and Merriweather from next/font/google
    3. Add font-related CSS variables to globals.css
    4. Configure font sizes and line heights
  </action>
  <verify>
    - Fonts loaded from Google Fonts (no external requests)
    - Typography classes work: font-sans, font-serif
    - Text renders correctly in browser
  </verify>
  <done>Типографика настроена (Inter + Merriweather)</done>
</task>

## Verification Criteria

1. **Цвета работают:** `bg-accent-orange`, `text-marble-white` применяются
2. **shadcn компоненты стилизованы:** Button, Card используют брендовые цвета
3. **Контраст WCAG AA:** Текст читаем на всех фонах
4. **Шрифты загружены:** Inter и Merriweather применяются
5. **CSS переменные:** Все --background, --primary, --accent настроены

## Success Criteria
- [ ] Цветовая палитра определена и документирована
- [ ] Tailwind конфигурация включает кастомные цвета
- [ ] CSS переменные shadcn настроены
- [ ] Шрифты подключены через next/font
- [ ] Типографика сконфигурирована
