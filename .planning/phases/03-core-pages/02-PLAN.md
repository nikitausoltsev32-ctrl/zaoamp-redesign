# Phase 03, Plan 02: Catalog Page

## Metadata
```yaml
phase: "03"
plan: "02"
wave: 3
depends_on: ["03-01"]
files_modified:
  - app/catalog/page.tsx
  - components/sections/
autonomous: true
```

## Objective
Создать страницу каталога со всеми 6 продуктами, фильтрами по фракции и удобной навигацией.

## must_haves
```yaml
truths:
  - "Страница каталога отображает все 6 продуктов"
  - "Фильтрация по категориям работает"
  - "Карточки продуктов содержат цены и характеристики"
  - "SEO мета-теги для каталога настроены"
  - "Навигация между категориями работает"

artifacts:
  - path: "app/catalog/page.tsx"
    provides: "Страница каталога"
    min_lines: 50
  - path: "components/sections/catalog-grid.tsx"
    provides: "Сетка продуктов"
    min_lines: 40
  - path: "components/sections/catalog-filters.tsx"
    provides: "Фильтры каталога"
    min_lines: 50
  - path: "components/sections/catalog-header.tsx"
    provides: "Заголовок каталога"
    min_lines: 30
  - path: "lib/data/products.ts"
    provides: "Данные всех продуктов"
    min_lines: 150

key_links:
  - from: "app/catalog/page.tsx"
    to: "components/sections/catalog-grid.tsx"
    via: "import { CatalogGrid }"
  - from: "components/sections/catalog-grid.tsx"
    to: "components/product-card.tsx"
    via: "import { ProductCard }"
  - from: "components/sections/catalog-filters.tsx"
    to: "components/sections/catalog-grid.tsx"
    via: "filter state"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Products Data</name>
  <files>
    - lib/data/products.ts
  </files>
  <action>
    1. Create lib/data/products.ts with all 6 products:
       - Product 1: Щебень 50-200 мм (2 900 ₽/т)
       - Product 2: Щебень 20-50 мм (3 100 ₽/т)
       - Product 3: Щебень 10-20 мм (3 300 ₽/т)
       - Product 4: Крошка 5-10 мм (3 500 ₽/т)
       - Product 5: Крошка 0-5 мм (3 200 ₽/т)
       - Product 6: Мука 0-0.2 мм (4 200 ₽/т)
    2. Each product includes:
       - id, slug, name, category
       - fraction, pricePerTon, priceRetail
       - description, applications[]
       - specifications: whiteness, density, packaging, certificates
       - seo: title, description, keywords
       - image placeholder
  </action>
  <verify>
    - All 6 products defined with full data
    - TypeScript types correct
    - Prices match ТЗ
  </verify>
  <done>Данные всех 6 продуктов созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create CatalogHeader Section</name>
  <files>
    - components/sections/catalog-header.tsx
  </files>
  <action>
    1. Create components/sections/catalog-header.tsx:
       - Breadcrumbs: Главная / Каталог
       - H1: "Каталог продукции"
       - Subtitle: "Мраморная крошка и щебень всех фракций. Прямой производитель."
       - Stats: "6 видов продукции" + "от 2 900 ₽/тонна"
  </action>
  <verify>
    - Breadcrumbs render correctly
    - H1 and subtitle present
    - Stats displayed
  </verify>
  <done>Заголовок каталога создан</done>
</task>

<task type="auto">
  <name>Task 3: Create CatalogFilters Component</name>
  <files>
    - components/sections/catalog-filters.tsx
  </files>
  <action>
    1. Create components/sections/catalog-filters.tsx:
       - Filter by category:
         - Все продукты
         - Щебень (фракции 10-200мм)
         - Крошка (фракции 0-10мм)
         - Мука/отсев (0-0.2мм, 0-5мм)
       - Use Select or ButtonGroup from shadcn
       - Active filter state management
       - Show product count for each filter
  </action>
  <verify>
    - Filters render correctly
    - State management works
    - Filter change updates product grid
  </verify>
  <done>Фильтры каталога созданы</done>
</task>

<task type="auto">
  <name>Task 4: Create CatalogGrid Section</name>
  <files>
    - components/sections/catalog-grid.tsx
  </files>
  <action>
    1. Create components/sections/catalog-grid.tsx:
       - Props: products[], activeFilter
       - Filter products based on active category
       - Grid layout: 1 col mobile, 2 col tablet, 3 col desktop
       - Use ProductCard for each product
       - Empty state if no products
       - Animation on filter change (framer-motion layout)
  </action>
  <verify>
    - Grid displays filtered products
    - Layout responsive
    - Animation on filter change
    - Empty state works
  </verify>
  <done>Сетка каталога создана</done>
</task>

<task type="auto">
  <name>Task 5: Assemble Catalog Page</name>
  <files>
    - app/catalog/page.tsx
  </files>
  <action>
    1. Create app/catalog/page.tsx:
       - Import all catalog components
       - Import products data
       - State: activeFilter (default: 'all')
       - Compose: CatalogHeader -> CatalogFilters -> CatalogGrid
       - Add SEO metadata
       - Title: "Каталог мраморной крошки и щебня | Цены от 2 900 ₽/т"
       - Description: "Все фракции мраморной крошки и щебня от производителя..."
  </action>
  <verify>
    - Page renders all components
    - Filtering works correctly
    - SEO meta tags present
    - Responsive layout
  </verify>
  <done>Страница каталога собрана</done>
</task>

## Verification Criteria

1. **6 продуктов:** Все продукты из ТЗ отображаются
2. **Фильтры:** 4 категории фильтрации работают
3. **Данные:** Цены, характеристики, применение
4. **SEO:** Title, description для каталога
5. **Адаптив:** Grid 1/2/3 колонки

## Success Criteria
- [ ] Данные всех 6 продуктов
- [ ] CatalogHeader с breadcrumbs
- [ ] Фильтры по категориям
- [ ] CatalogGrid с анимацией
- [ ] SEO мета-теги
- [ ] Страница каталога собрана
