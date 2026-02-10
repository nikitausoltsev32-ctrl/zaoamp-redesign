# Phase 03, Plan 04: About & Contact Pages

## Metadata
```yaml
phase: "03"
plan: "04"
wave: 3
depends_on: ["03-03"]
files_modified:
  - app/about/page.tsx
  - app/contacts/page.tsx
  - app/delivery/page.tsx
autonomous: true
```

## Objective
Создать страницы "О компании", "Контакты" и "Доставка" с полной информацией из ТЗ.

## must_haves
```yaml
truths:
  - "Страница О компании содержит историю и преимущества"
  - "Страница Контакты с картой и формой обратной связи"
  - "Страница Доставка с условиями и ценами"
  - "Все контакты из ТЗ отображаются"
  - "Карта (react-leaflet) интегрирована"

artifacts:
  - path: "app/about/page.tsx"
    provides: "Страница О компании"
    min_lines: 80
  - path: "app/contacts/page.tsx"
    provides: "Страница контактов"
    min_lines: 80
  - path: "app/delivery/page.tsx"
    provides: "Страница доставки"
    min_lines: 60
  - path: "components/sections/about/"
    provides: "Секции страницы О компании"
  - path: "components/sections/contacts/"
    provides: "Секции страницы контактов"
  - path: "components/map.tsx"
    provides: "Компонент карты"
    min_lines: 40

key_links:
  - from: "app/contacts/page.tsx"
    to: "components/map.tsx"
    via: "import { Map }"
  - from: "app/contacts/page.tsx"
    to: "components/sections/contacts/contact-form.tsx"
    via: "import { ContactForm }"
```

## Tasks

<task type="auto">
  <name>Task 1: Create About Page</name>
  <files>
    - app/about/page.tsx
    - components/sections/about/about-hero.tsx
    - components/sections/about/about-story.tsx
    - components/sections/about/about-production.tsx
  </files>
  <action>
    1. Create sections:
       - about-hero.tsx: Заголовок "О компании", подзаголовок
       - about-story.tsx: История компании, миссия, ценности
       - about-production.tsx: О производстве, мощности (45 000 т/мес), месторождение
    2. Create app/about/page.tsx:
       - Compose all sections
       - Add company stats (300+ клиентов, 50 000+ тонн)
       - SEO: title "О компании АМП ИМПОРТ-ЭКСПОРТ | Производитель мраморной крошки"
       - Include certificate references
  </action>
  <verify>
    - All sections render
    - Content matches ТЗ
    - Stats displayed correctly
  </verify>
  <done>Страница О компании создана</done>
</task>

<task type="auto">
  <name>Task 2: Create Map Component</name>
  <files>
    - components/map.tsx
  </files>
  <action>
    1. Install: `npm install react-leaflet leaflet @types/leaflet`
    2. Create components/map.tsx:
       - Props: lat, lng, zoom?, markerText?
       - Use react-leaflet MapContainer, TileLayer, Marker, Popup
       - Coordinates: Екатеринбург (56.8389, 60.6057)
       - Marker: Company address
       - Responsive height
       - Lazy loading with dynamic import
    3. Add leaflet CSS import
  </action>
  <verify>
    - Map renders correctly
    - Marker shows company location
    - Popup with address works
    - Responsive sizing
  </verify>
  <done>Компонент карты создан</done>
</task>

<task type="auto">
  <name>Task 3: Create ContactForm Component</name>
  <files>
    - components/sections/contacts/contact-form.tsx
  </files>
  <action>
    1. Create components/sections/contacts/contact-form.tsx:
       - Form fields:
         - Имя (required)
         - Телефон (required, masked)
         - Email (optional)
         - Сообщение (textarea)
         - Тема обращения (select)
       - Validation: react-hook-form + zod
       - Submit button with loading state
       - Success/error feedback
       - Placeholder for API integration
  </action>
  <verify>
    - Form validates correctly
    - Phone masking works
    - Submit shows loading state
    - Success message displayed
  </verify>
  <done>Форма обратной связи создана</done>
</task>

<task type="auto">
  <name>Task 4: Create Contacts Page</name>
  <files>
    - app/contacts/page.tsx
    - components/sections/contacts/contact-info.tsx
    - components/sections/contacts/contact-cards.tsx
  </files>
  <action>
    1. Create sections:
       - contact-info.tsx: Адрес, телефон, email, рабочие часы
       - contact-cards.tsx: Карточки с быстрыми действиями (позвонить, написать)
    2. Create app/contacts/page.tsx:
       - Compose: ContactInfo -> Map -> ContactForm -> ContactCards
       - Include all contacts from ТЗ:
         - Address: г. Екатеринбург, ул. Евгения Савкова 29, офис 262
         - Phone: +7 (919) 393-19-92
         - Email: evoprod@mail.ru
         - Telegram: @usolst
         - WhatsApp: +79193931992
       - SEO: title "Контакты | АМП ИМПОРТ-ЭКСПОРТ"
       - Add Schema.org ContactPoint JSON-LD
  </action>
  <verify>
    - All contacts displayed
    - Map renders
    - Form works
    - Click-to-call links work
  </verify>
  <done>Страница контактов создана</done>
</task>

<task type="auto">
  <name>Task 5: Create Delivery Page</name>
  <files>
    - app/delivery/page.tsx
    - components/sections/delivery/delivery-hero.tsx
    - components/sections/delivery/delivery-pricing.tsx
    - components/sections/delivery/delivery-regions.tsx
    - components/sections/delivery/delivery-packaging.tsx
  </files>
  <action>
    1. Create sections:
       - delivery-hero.tsx: Заголовок "Доставка", общая информация
       - delivery-pricing.tsx: Таблица цен на доставку:
         - Екатеринбург: от 1500 ₽
         - Урал: от 3000 ₽
         - Москва: от 18 000 ₽
         - Ж/д перевозки
       - delivery-regions.tsx: География поставок (карта или список)
       - delivery-packaging.tsx: Варианты упаковки:
         - Биг-бэг 1000 кг: +120 ₽
         - Мешки 50 кг: +35 ₽
         - Мешки 25 кг: +25 ₽
         - Навал: без наценки
    2. Create app/delivery/page.tsx:
       - Compose all sections
       - CTA: "Рассчитать доставку"
       - SEO: title "Условия доставки | АМП ИМПОРТ-ЭКСПОРТ"
  </action>
  <verify>
    - All pricing from ТЗ displayed
    - Packaging options listed
    - Regions covered
    - CTA visible
  </verify>
  <done>Страница доставки создана</done>
</task>

## Verification Criteria

1. **О компании:** История, производство, статистика
2. **Контакты:** Все контакты + карта + форма
3. **Доставка:** Цены, регионы, упаковка
4. **Карта:** react-leaflet работает
5. **Форма:** Валидация + feedback
6. **SEO:** Уникальные мета-теги

## Success Criteria
- [ ] Страница О компании
- [ ] Компонент карты
- [ ] Форма обратной связи
- [ ] Страница контактов
- [ ] Страница доставки
- [ ] Вся информация из ТЗ
