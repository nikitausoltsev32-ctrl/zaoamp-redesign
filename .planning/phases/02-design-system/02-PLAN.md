# Phase 02, Plan 02: Base Components

## Metadata
```yaml
phase: "02"
plan: "02"
wave: 2
depends_on: ["02-01"]
files_modified:
  - components/ui/
  - components/
autonomous: true
```

## Objective
Установить базовые компоненты shadcn/ui и создать кастомные компоненты для сайта мраморной крошки.

## must_haves
```yaml
truths:
  - "Все необходимые shadcn компоненты установлены"
  - "Кастомные компоненты созданы и стилизованы"
  - "Компоненты используют брендовую тему"
  - "Props типизированы TypeScript"
  - "Компоненты экспортируются из index файлов"

artifacts:
  - path: "components/ui/button.tsx"
    provides: "Кнопки с вариантами"
    min_lines: 50
  - path: "components/ui/card.tsx"
    provides: "Карточки контента"
    min_lines: 40
  - path: "components/ui/input.tsx"
    provides: "Поля ввода"
    min_lines: 25
  - path: "components/ui/label.tsx"
    provides: "Метки форм"
    min_lines: 20
  - path: "components/ui/select.tsx"
    provides: "Выпадающие списки"
    min_lines: 120
  - path: "components/ui/dialog.tsx"
    provides: "Модальные окна"
    min_lines: 100
  - path: "components/ui/badge.tsx"
    provides: "Бейджи/теги"
    min_lines: 30
  - path: "components/ui/separator.tsx"
    provides: "Разделители"
    min_lines: 25
  - path: "components/ui/sheet.tsx"
    provides: "Боковые панели"
    min_lines: 120
  - path: "components/product-card.tsx"
    provides: "Карточка продукта"
    min_lines: 50
  - path: "components/price-tag.tsx"
    provides: "Отображение цены"
    min_lines: 25
  - path: "components/section-header.tsx"
    provides: "Заголовок секции"
    min_lines: 30

key_links:
  - from: "components/product-card.tsx"
    to: "components/ui/card.tsx"
    via: "import { Card }"
  - from: "components/product-card.tsx"
    to: "components/ui/badge.tsx"
    via: "import { Badge }"
  - from: "components/price-tag.tsx"
    to: "components/ui/badge.tsx"
    via: "import { Badge }"
```

## Tasks

<task type="auto">
  <name>Task 1: Install shadcn/ui Components</name>
  <files>
    - components/ui/button.tsx
    - components/ui/card.tsx
    - components/ui/input.tsx
    - components/ui/label.tsx
    - components/ui/select.tsx
    - components/ui/dialog.tsx
    - components/ui/badge.tsx
    - components/ui/separator.tsx
    - components/ui/sheet.tsx
  </files>
  <action>
    1. Install shadcn components:
       - `npx shadcn add button card input label select dialog badge separator sheet`
    2. Verify all components installed in components/ui/
    3. Check that imports use @/lib/utils
    4. Verify components use CSS variables from theme
  </action>
  <verify>
    - All component files exist in components/ui/
    - Button renders with variants (default, secondary, ghost, outline)
    - Card has Header, Title, Description, Content, Footer
  </verify>
  <done>Базовые shadcn компоненты установлены</done>
</task>

<task type="auto">
  <name>Task 2: Create ProductCard Component</name>
  <files>
    - components/product-card.tsx
    - types/product.ts
  </files>
  <action>
    1. Create types/product.ts with Product interface:
       - id, name, fraction, pricePerTon, image, description, applications[], specs{whiteness, density, packaging}
    2. Create components/product-card.tsx:
       - Props: Product, onClick?, variant?: 'default' | 'compact'
       - Use Card, CardHeader, CardContent, CardFooter
       - Display: image, name, fraction badge, price, brief description
       - CTA button "Подробнее" or "Рассчитать стоимость"
    3. Style with brand colors
  </action>
  <verify>
    - ProductCard renders with sample data
    - All product fields displayed correctly
    - Responsive design works
  </verify>
  <done>Компонент ProductCard создан и стилизован</done>
</task>

<task type="auto">
  <name>Task 3: Create PriceTag Component</name>
  <files>
    - components/price-tag.tsx
  </files>
  <action>
    1. Create components/price-tag.tsx:
       - Props: price: number, unit?: string, size?: 'sm' | 'md' | 'lg', oldPrice?: number
       - Format price: "3 500 ₽"
       - Show unit: "/тонна", "/мешок 25кг"
       - Optional old price with strikethrough
       - Use accent color for price
    2. Style variants:
       - sm: text-sm
       - md: text-xl
       - lg: text-3xl font-bold
  </action>
  <verify>
    - PriceTag displays formatted price
    - Old price shown with strikethrough when provided
    - Different sizes render correctly
  </verify>
  <done>Компонент PriceTag создан с форматированием</done>
</task>

<task type="auto">
  <name>Task 4: Create SectionHeader Component</name>
  <files>
    - components/section-header.tsx
  </files>
  <action>
    1. Create components/section-header.tsx:
       - Props: title: string, subtitle?: string, centered?: boolean, withLine?: boolean
       - Display title with optional subtitle
       - Option for centered alignment
       - Option for decorative line below
    2. Style:
       - Title: font-serif, text-2xl/md:text-3xl/lg:text-4xl
       - Subtitle: text-muted-foreground, text-base
       - Line: w-16 h-1 bg-accent-orange
  </action>
  <verify>
    - SectionHeader renders with and without subtitle
    - Centered variant works
    - Line appears when withLine=true
  </verify>
  <done>Компонент SectionHeader создан</done>
</task>

<task type="auto">
  <name>Task 5: Create Component Index Files</name>
  <files>
    - components/ui/index.ts
    - components/index.ts
  </files>
  <action>
    1. Create components/ui/index.ts:
       - Export all shadcn components
    2. Create components/index.ts:
       - Export custom components
       - Export ui components
    3. Organize exports for clean imports
  </action>
  <verify>
    - Import works: `import { Button, ProductCard } from '@/components'`
    - No circular dependencies
  </verify>
  <done>Индекс файлы созданы для удобного импорта</done>
</task>

## Verification Criteria

1. **Все компоненты установлены:** 9 shadcn + 3 кастомных компонента
2. **TypeScript типизация:** Все props типизированы, нет `any`
3. **Брендинг:** Компоненты используют брендовые цвета
4. **Импорты:** Работают через @/components
5. **Story/test:** Компоненты рендерятся без ошибок

## Success Criteria
- [ ] 9 базовых shadcn компонентов установлены
- [ ] ProductCard создан с полной функциональностью
- [ ] PriceTag создан с форматированием цен
- [ ] SectionHeader создан для заголовков
- [ ] Индекс файлы для чистых импортов
