# Phase 03, Plan 01: Home Page

## Metadata
```yaml
phase: "03"
plan: "01"
wave: 3
depends_on: ["02-03"]
files_modified:
  - app/page.tsx
  - components/sections/
autonomous: true
```

## Objective
Создать главную страницу с Hero-секцией, быстрым доступом к калькулятору, преимуществами и призывом к действию.

## must_haves
```yaml
truths:
  - "Hero секция с заголовком и CTA отображается"
  - "Секция преимуществ с 8 пунктами работает"
  - "Быстрый доступ к каталогу (3-4 продукта)"
  - "Контакты и быстрая связь видны"
  - "SEO мета-теги настроены"

artifacts:
  - path: "app/page.tsx"
    provides: "Главная страница"
    min_lines: 40
  - path: "app/layout.tsx"
    provides: "Metadata для SEO"
    min_lines: 50
  - path: "components/sections/hero.tsx"
    provides: "Hero секция"
    min_lines: 60
  - path: "components/sections/benefits.tsx"
    provides: "Секция преимуществ"
    min_lines: 80
  - path: "components/sections/featured-products.tsx"
    provides: "Популярные продукты"
    min_lines: 50
  - path: "components/sections/cta-section.tsx"
    provides: "CTA блок"
    min_lines: 30
  - path: "components/benefit-card.tsx"
    provides: "Карточка преимущества"
    min_lines: 25

key_links:
  - from: "app/page.tsx"
    to: "components/sections/hero.tsx"
    via: "import { HeroSection }"
  - from: "components/sections/hero.tsx"
    to: "/catalog"
    via: "Link to catalog"
  - from: "components/sections/featured-products.tsx"
    to: "components/product-card.tsx"
    via: "import { ProductCard }"
```

## Tasks

<task type="auto">
  <name>Task 1: Create BenefitCard Component</name>
  <files>
    - components/benefit-card.tsx
    - lib/data/benefits.ts
  </files>
  <action>
    1. Create lib/data/benefits.ts:
       - 8 benefits from ТЗ with icons:
         1. Собственное месторождение (Mountain icon)
         2. Белизна до 98% (Sparkles icon)
         3. 45 000 тонн/мес (Factory icon)
         4. Точное фракционирование (Ruler icon)
         5. Химическая чистота (Flask icon)
         6. Кубическая форма (Box icon)
         7. 300+ клиентов (Users icon)
         8. Упаковка до 1 тонны (Package icon)
    2. Create components/benefit-card.tsx:
       - Props: icon, title, description
       - Card with icon, title, short description
       - Hover animation with framer-motion
  </action>
  <verify>
    - All 8 benefits defined
    - BenefitCard renders with icon, title, description
    - Hover animation works
  </verify>
  <done>Компонент BenefitCard и данные созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create Hero Section</name>
  <files>
    - components/sections/hero.tsx
  </files>
  <action>
    1. Create components/sections/hero.tsx:
       - Full-width section with gradient background (stone-50 to white)
       - Content:
         - Badge: "Производитель №1 на Урале"
         - H1: "Мраморная крошка и щебень премиум-качества"
         - Subtitle: "Белизна до 98%. Доставка по всей России. От 2 900 ₽/тонна."
         - Two CTAs: "Каталог продукции" (primary), "Рассчитать стоимость" (secondary)
       - Right side: Hero image (placeholder for now)
       - Responsive: stack on mobile
       - Animation: fade-in on load
  </action>
  <verify>
    - Hero renders with all content
    - CTAs link to correct pages
    - Responsive layout works
    - Animation plays on load
  </verify>
  <done>Hero секция создана</done>
</task>

<task type="auto">
  <name>Task 3: Create Benefits Section</name>
  <files>
    - components/sections/benefits.tsx
  </files>
  <action>
    1. Create components/sections/benefits.tsx:
       - SectionHeader: "Почему выбирают нас"
       - Grid: 2 columns mobile, 4 columns desktop
       - Map through 8 benefits from data
       - Use BenefitCard component
       - Background: subtle pattern or gradient
  </action>
  <verify>
    - All 8 benefits displayed
    - Grid responsive (2x4 on desktop)
    - SectionHeader with title and subtitle
  </verify>
  <done>Секция преимуществ создана</done>
</task>

<task type="auto">
  <name>Task 4: Create Featured Products Section</name>
  <files>
    - components/sections/featured-products.tsx
  </files>
  <action>
    1. Create components/sections/featured-products.tsx:
       - SectionHeader: "Популярная продукция"
       - Show 4 most popular products:
         1. Щебень 20-50 мм (строительство)
         2. Крошка 5-10 мм (ландшафт)
         3. Щебень 10-20 мм (бетон)
         4. Крошка 0-5 мм (смеси)
       - Use ProductCard component
       - Grid: 1 col mobile, 2 col tablet, 4 col desktop
       - "Все продукты" link at bottom
  </action>
  <verify>
    - 4 products displayed
    - ProductCard renders correctly
    - Grid responsive
    - Link to catalog works
  </verify>
  <done>Секция популярных продуктов создана</done>
</task>

<task type="auto">
  <name>Task 5: Create CTA Section</name>
  <files>
    - components/sections/cta-section.tsx
  </files>
  <action>
    1. Create components/sections/cta-section.tsx:
       - Background: accent color (orange/gold gradient)
       - Content:
         - H2: "Нужна консультация?"
         - Text: "Наши специалисты помогут подобрать оптимальную фракцию"
         - CTA: "Позвонить" (phone link) + "Написать в WhatsApp"
       - Decorative elements (marble texture pattern)
  </action>
  <verify>
    - CTA section stands out with accent background
    - Phone link works
    - WhatsApp link works
  </verify>
  <done>CTA секция создана</done>
</task>

<task type="auto">
  <name>Task 6: Assemble Home Page</name>
  <files>
    - app/page.tsx
    - app/layout.tsx
  </files>
  <action>
    1. Update app/page.tsx:
       - Import all section components
       - Compose page: Hero -> Benefits -> Featured Products -> CTA
    2. Update app/layout.tsx metadata:
       - title: "Мраморная крошка и щебень | ЗАО АМП ИМПОРТ-ЭКСПОРТ"
       - description: "Производитель белой мраморной крошки и щебня. Доставка по России. Цены от 2 900 ₽/тонна."
       - keywords: "мраморная крошка, мраморный щебень, купить щебень екатеринбург"
  </action>
  <verify>
    - Page renders all sections
    - Smooth scroll between sections
    - SEO meta tags present in head
  </verify>
  <done>Главная страница собрана</done>
</task>

## Verification Criteria

1. **Hero секция:** Заголовок, подзаголовок, 2 CTA
2. **Преимущества:** 8 карточек в grid
3. **Продукты:** 4 карточки с ценами
4. **CTA:** Контрастный блок с контактами
5. **SEO:** Title, description в мета-тегах
6. **Адаптив:** Все секции на mobile

## Success Criteria
- [ ] BenefitCard компонент
- [ ] Hero секция с CTA
- [ ] Benefits секция (8 преимуществ)
- [ ] Featured Products секция (4 продукта)
- [ ] CTA секция с контактами
- [ ] SEO мета-теги настроены
- [ ] Главная страница собрана
