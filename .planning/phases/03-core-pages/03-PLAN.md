# Phase 03, Plan 03: Product Detail Pages

## Metadata
```yaml
phase: "03"
plan: "03"
wave: 3
depends_on: ["03-02"]
files_modified:
  - app/product/[slug]/page.tsx
  - components/sections/product/
autonomous: true
```

## Objective
Создать детальные страницы для каждого продукта с полной информацией, характеристиками и CTA.

## must_haves
```yaml
truths:
  - "Страница продукта отображает полную информацию"
  - "Все характеристики из ТЗ представлены"
  - "Применение продукта с примерами"
  - "Калькулятор цены доступен"
  - "SEO оптимизация под конкретный продукт"

artifacts:
  - path: "app/product/[slug]/page.tsx"
    provides: "Динамическая страница продукта"
    min_lines: 60
  - path: "components/sections/product/product-hero.tsx"
    provides: "Hero секция продукта"
    min_lines: 70
  - path: "components/sections/product/product-specs.tsx"
    provides: "Технические характеристики"
    min_lines: 60
  - path: "components/sections/product/product-applications.tsx"
    provides: "Применение продукта"
    min_lines: 50
  - path: "components/sections/product/product-calculator.tsx"
    provides: "Калькулятор на странице продукта"
    min_lines: 80
  - path: "components/sections/product/product-cta.tsx"
    provides: "CTA блок на странице"
    min_lines: 40
  - path: "lib/utils/products.ts"
    provides: "Утилиты для работы с продуктами"
    min_lines: 30

key_links:
  - from: "app/product/[slug]/page.tsx"
    to: "lib/data/products.ts"
    via: "import { products }"
  - from: "app/product/[slug]/page.tsx"
    to: "components/sections/product/product-hero.tsx"
    via: "import { ProductHero }"
  - from: "components/sections/product/product-calculator.tsx"
    to: "components/calculator.tsx"
    via: "import { Calculator }"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Product Utilities</name>
  <files>
    - lib/utils/products.ts
  </files>
  <action>
    1. Create lib/utils/products.ts:
       - getProductBySlug(slug: string) -> Product | undefined
       - getAllProductSlugs() -> string[]
       - getRelatedProducts(currentSlug: string, limit?: number) -> Product[]
       - getProductsByCategory(category: string) -> Product[]
    2. Export functions for use in pages
  </action>
  <verify>
    - Functions return correct data
    - TypeScript types correct
    - Edge cases handled (not found)
  </verify>
  <done>Утилиты для продуктов созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create ProductHero Section</name>
  <files>
    - components/sections/product/product-hero.tsx
  </files>
  <action>
    1. Create components/sections/product/product-hero.tsx:
       - Props: product: Product
       - Layout: 2 columns (image left, info right)
       - Content:
         - Breadcrumbs: Каталог / [Category] / [Product]
         - H1: Product name
         - Badge: Fraction (e.g., "50-200 мм")
         - Price: Large price display with PriceTag
         - Short description
         - Quick specs: Белизна, Плотность, Упаковка
         - CTA: "Рассчитать стоимость" button
       - Image placeholder with aspect ratio
  </action>
  <verify>
    - All product data displayed
    - Price formatted correctly
    - Breadcrumbs work
    - CTA button visible
  </verify>
  <done>ProductHero секция создана</done>
</task>

<task type="auto">
  <name>Task 3: Create ProductSpecs Section</name>
  <files>
    - components/sections/product/product-specs.tsx
  </files>
  <action>
    1. Create components/sections/product/product-specs.tsx:
       - Props: product: Product
       - SectionHeader: "Технические характеристики"
       - Specs table or grid with:
         - Фракция
         - Белизна (%)
         - Насыпная плотность
         - Форма зерна
         - Морозостойкость
         - Водопоглощение
         - Содержание CaCO₃
         - Радиоактивность
         - Упаковка
       - Highlight key specs with badges
       - Download certificate link (placeholder)
  </action>
  <verify>
    - All specs from ТЗ displayed
    - Table/grid responsive
    - Visual hierarchy clear
  </verify>
  <done>Секция характеристик создана</done>
</task>

<task type="auto">
  <name>Task 4: Create ProductApplications Section</name>
  <files>
    - components/sections/product/product-applications.tsx
  </files>
  <action>
    1. Create components/sections/product/product-applications.tsx:
       - Props: product: Product
       - SectionHeader: "Применение"
       - Grid of application cards:
         - Each card: icon, title, description
         - Use CheckCircle2 or specific icons
       - Display all applications from product data
       - Group related applications if many
  </action>
  <verify>
    - All applications displayed
    - Icons appropriate for each use case
    - Responsive grid
  </verify>
  <done>Секция применения создана</done>
</task>

<task type="auto">
  <name>Task 5: Create ProductCalculator Section</name>
  <files>
    - components/sections/product/product-calculator.tsx
  </files>
  <action>
    1. Create components/sections/product/product-calculator.tsx:
       - Props: product: Product
       - Pre-fill product in calculator
       - SectionHeader: "Рассчитать стоимость"
       - Calculator component with:
         - Volume input (tons)
         - Packaging selection (big-bag, bags, bulk)
         - Delivery region selector
         - Price calculation display
         - CTA: "Оставить заявку"
       - Show price breakdown
  </action>
  <verify>
    - Calculator pre-filled with product
    - Calculation logic works
    - CTA opens order form
  </verify>
  <done>Калькулятор на странице продукта создан</done>
</task>

<task type="auto">
  <name>Task 6: Create ProductCTA Section</name>
  <files>
    - components/sections/product/product-cta.tsx
  </files>
  <action>
    1. Create components/sections/product/product-cta.tsx:
       - Background: gradient or image
       - H2: "Остались вопросы?"
       - Text: "Наши специалисты помогут подобрать оптимальное решение"
       - Contact options:
         - Phone button (click to call)
         - WhatsApp button
         - Telegram button
         - Email link
       - Working hours note
  </action>
  <verify>
    - All contact links work
    - Buttons styled prominently
    - Mobile-friendly layout
  </verify>
  <done>CTA секция создана</done>
</task>

<task type="auto">
  <name>Task 7: Create Product Detail Page</name>
  <files>
    - app/product/[slug]/page.tsx
  </files>
  <action>
    1. Create app/product/[slug]/page.tsx:
       - Generate static params: getAllProductSlugs()
       - getProductBySlug(params.slug)
       - Handle not found: notFound() if product undefined
       - Compose page sections:
         - ProductHero
         - ProductSpecs
         - ProductApplications
         - ProductCalculator
         - ProductCTA
       - Metadata generation:
         - title: product.seo.title
         - description: product.seo.description
         - keywords: product.seo.keywords
       - JSON-LD structured data for Product
  </action>
  <verify>
    - All product pages generate
    - 404 for invalid slugs
    - SEO meta correct per product
    - All sections render
  </verify>
  <done>Страница продукта создана</done>
</task>

## Verification Criteria

1. **6 страниц:** Каждый продукт имеет страницу
2. **Характеристики:** Все specs из ТЗ
3. **Применение:** Все use cases
4. **Калькулятор:** Pre-filled, работает
5. **SEO:** Уникальные title/description per product
6. **404:** Неверные slug возвращают notFound

## Success Criteria
- [ ] Утилиты для продуктов
- [ ] ProductHero с ценой
- [ ] ProductSpecs таблица
- [ ] ProductApplications с иконками
- [ ] ProductCalculator
- [ ] ProductCTA с контактами
- [ ] Динамическая страница с метаданными
