# Phase 02, Plan 03: Layout Components

## Metadata
```yaml
phase: "02"
plan: "03"
wave: 2
depends_on: ["02-02"]
files_modified:
  - components/layout/
  - app/layout.tsx
autonomous: true
```

## Objective
Создать layout-компоненты: Header с навигацией, Footer с контактами, и основной layout приложения.

## must_haves
```yaml
truths:
  - "Header с навигацией и логотипом работает"
  - "Footer с контактами и ссылками отображается"
  - "Мобильное меню (Sheet) функционирует"
  - "Layout компоненты используются в корневом layout"
  - "Все контакты из ТЗ отображаются"

artifacts:
  - path: "components/layout/header.tsx"
    provides: "Шапка сайта с навигацией"
    min_lines: 80
  - path: "components/layout/footer.tsx"
    provides: "Подвал сайта с контактами"
    min_lines: 60
  - path: "components/layout/mobile-nav.tsx"
    provides: "Мобильная навигация"
    min_lines: 50
  - path: "components/layout/logo.tsx"
    provides: "Логотип компании"
    min_lines: 20
  - path: "components/layout/contact-bar.tsx"
    provides: "Панель контактов (телефон, WhatsApp)"
    min_lines: 40
  - path: "app/layout.tsx"
    provides: "Корневой layout с Header и Footer"
    min_lines: 40
  - path: "lib/data/navigation.ts"
    provides: "Данные навигации"
    min_lines: 30

key_links:
  - from: "app/layout.tsx"
    to: "components/layout/header.tsx"
    via: "import { Header }"
  - from: "app/layout.tsx"
    to: "components/layout/footer.tsx"
    via: "import { Footer }"
  - from: "components/layout/header.tsx"
    to: "components/layout/mobile-nav.tsx"
    via: "import { MobileNav }"
  - from: "components/layout/header.tsx"
    to: "components/layout/contact-bar.tsx"
    via: "import { ContactBar }"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Navigation Data</name>
  <files>
    - lib/data/navigation.ts
    - lib/data/contacts.ts
  </files>
  <action>
    1. Create lib/data/navigation.ts:
       - navItems: [{ label: 'Главная', href: '/' }, { label: 'Каталог', href: '/catalog' }, { label: 'О компании', href: '/about' }, { label: 'Доставка', href: '/delivery' }, { label: 'Контакты', href: '/contacts' }]
       - productLinks for catalog dropdown
    2. Create lib/data/contacts.ts:
       - phone: '+7 (919) 393-19-92'
       - email: 'evoprod@mail.ru'
       - address: 'г. Екатеринбург, ул. Евгения Савкова 29, офис 262'
       - telegram: '@usolst'
       - whatsapp: '+79193931992'
       - workingHours: 'Пн-Пт: 9:00-18:00'
  </action>
  <verify>
    - Navigation data is typed and exported
    - Contacts data matches ТЗ exactly
  </verify>
  <done>Данные навигации и контактов созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create Logo Component</name>
  <files>
    - components/layout/logo.tsx
  </files>
  <action>
    1. Create components/layout/logo.tsx:
       - Props: size?: 'sm' | 'md' | 'lg', showText?: boolean
       - Display company name: "АМП ИМПОРТ-ЭКСПОРТ"
       - Optional subtitle: "Мраморная крошка и щебень"
       - Use Link to home page
       - Style: font-serif for company name
    2. Variants:
       - sm: text-lg (for mobile)
       - md: text-xl (for header)
       - lg: text-3xl (for footer)
  </action>
  <verify>
    - Logo renders with text
    - Link navigates to home
    - Sizes work correctly
  </verify>
  <done>Компонент Logo создан</done>
</task>

<task type="auto">
  <name>Task 3: Create ContactBar Component</name>
  <files>
    - components/layout/contact-bar.tsx
  </files>
  <action>
    1. Create components/layout/contact-bar.tsx:
       - Props: variant?: 'header' | 'footer' | 'mobile'
       - Display:
         - Phone number (clickable tel: link)
         - WhatsApp button (icon + link)
         - Working hours
       - For header: compact, horizontal layout
       - For footer: full info, vertical layout
       - Use lucide icons: Phone, MessageCircle
  </action>
  <verify>
    - Phone link works (tel:+79193931992)
    - WhatsApp link correct (wa.me/+79193931992)
    - All variants render properly
  </verify>
  <done>Компонент ContactBar создан</done>
</task>

<task type="auto">
  <name>Task 4: Create MobileNav Component</name>
  <files>
    - components/layout/mobile-nav.tsx
  </files>
  <action>
    1. Create components/layout/mobile-nav.tsx:
       - Use Sheet component from shadcn
       - Trigger: Menu button (hamburger icon)
       - Content:
         - Logo at top
         - Navigation links (vertical list)
         - ContactBar in footer of sheet
       - Close sheet on link click
       - Animate with framer-motion
  </action>
  <verify>
    - Sheet opens on menu click
    - Navigation links work
    - Sheet closes on route change
    - Contact info visible
  </verify>
  <done>Мобильная навигация создана</done>
</task>

<task type="auto">
  <name>Task 5: Create Header Component</name>
  <files>
    - components/layout/header.tsx
  </files>
  <action>
    1. Create components/layout/header.tsx:
       - Fixed position at top
       - Background: white with shadow on scroll
       - Content:
         - Logo (left)
         - Desktop navigation (center, hidden on mobile)
         - ContactBar compact (right, hidden on mobile)
         - MobileNav trigger (right, mobile only)
       - Use Container for max-width
       - Smooth scroll behavior
    2. Add scroll detection for shadow effect
  </action>
  <verify>
    - Header fixed on scroll
    - Desktop nav visible on lg+
    - Mobile menu trigger on <lg
    - Shadow appears on scroll
  </verify>
  <done>Header компонент создан</done>
</task>

<task type="auto">
  <name>Task 6: Create Footer Component</name>
  <files>
    - components/layout/footer.tsx
  </files>
  <action>
    1. Create components/layout/footer.tsx:
       - Background: stone-900 (dark)
       - Text: stone-100
       - Sections:
         - Logo + company description
         - Navigation links column
         - Products quick links
         - Contact info full (address, phone, email, social)
       - Bottom bar: Copyright + legal links
       - Use grid layout (responsive)
  </action>
  <verify>
    - All contact info from ТЗ displayed
    - Navigation links work
    - Social links (Telegram, WhatsApp)
    - Responsive grid works
  </verify>
  <done>Footer компонент создан</done>
</task>

<task type="auto">
  <name>Task 7: Update Root Layout</name>
  <files>
    - app/layout.tsx
  </files>
  <action>
    1. Update app/layout.tsx:
       - Import Header, Footer from @/components/layout
       - Wrap content: Header -> main -> Footer
       - Add proper meta tags (title, description)
       - Use ThemeProvider if needed
       - Configure fonts (Inter, Merriweather)
    2. Test layout with placeholder content
  </action>
  <verify>
    - Header visible on all pages
    - Footer visible on all pages
    - Main content has proper spacing
    - No layout shift on load
  </verify>
  <done>Корневой layout обновлён</done>
</task>

## Verification Criteria

1. **Header работает:** Навигация, логотип, контакты
2. **Мобильное меню:** Sheet открывается, ссылки работают
3. **Footer:** Все контакты отображаются
4. **Layout структура:** Header -> main -> Footer
5. **Responsive:** Работает на всех размерах экрана

## Success Criteria
- [ ] Навигация и контакты в data файлах
- [ ] Logo компонент с размерами
- [ ] ContactBar с вариантами
- [ ] MobileNav на Sheet
- [ ] Header с scroll эффектом
- [ ] Footer со всеми ссылками
- [ ] Корневой layout обновлён
