# Phase 05, Plan 03: Responsive & Mobile

## Metadata
```yaml
phase: "05"
plan: "03"
wave: 5
depends_on: ["05-02"]
files_modified:
  - app/globals.css
  - components/
autonomous: true
```

## Objective
Обеспечить полную адаптивность сайта: mobile-first подход, работа на всех устройствах, тач-интерфейс.

## must_haves
```yaml
truths:
  - "Сайт работает на мобильных (320px+)"
  - "Mobile-first CSS подход"
  - "Тач-интерфейс оптимизирован"
  - "Шрифты читаемы на всех размерах"
  - "Навигация работает на тач-устройствах"

artifacts:
  - path: "app/globals.css"
    provides: "Адаптивные стили"
    min_lines: 100
  - path: "components/layout/mobile-nav.tsx"
    provides: "Мобильная навигация"
    min_lines: 60
  - path: "components/ui/responsive-container.tsx"
    provides: "Адаптивный контейнер"
    min_lines: 20

key_links:
  - from: "app/globals.css"
    to: "Tailwind breakpoints"
    via: "@screen directives"
  - from: "components/layout/header.tsx"
    to: "components/layout/mobile-nav.tsx"
    via: "Mobile menu trigger"
```

## Tasks

<task type="auto">
  <name>Task 1: Audit Responsive Design</name>
  <files>
    - All page components
  </files>
  <action>
    1. Review all pages at breakpoints:
       - 320px (small mobile)
       - 375px (mobile)
       - 768px (tablet)
       - 1024px (desktop)
       - 1440px+ (large)
    2. Check issues:
       - Horizontal scroll
       - Overlapping elements
       - Too small text
       - Button sizes
       - Image overflow
    3. Document issues per component
  </action>
  <verify>
    - All pages tested
    - Issues documented
    - Priority list created
  </verify>
  <done>Аудит адаптивности выполнен</done>
</task>

<task type="auto">
  <name>Task 2: Fix Mobile Layout Issues</name>
  <files>
    - components/sections/hero.tsx
    - components/sections/benefits.tsx
    - components/sections/catalog-grid.tsx
    - components/calculator.tsx
  </files>
  <action>
    1. Fix Hero section:
       - Stack vertically on mobile
       - Reduce font sizes
       - Adjust spacing
    2. Fix Benefits grid:
       - 1 column mobile, 2 tablet, 4 desktop
    3. Fix Catalog grid:
       - 1 column mobile, 2 tablet, 3 desktop
    4. Fix Calculator:
       - Full width inputs on mobile
       - Stacked layout
    5. Ensure touch targets >= 44px
  </action>
  <verify>
    - No horizontal scroll
    - All touch targets adequate
    - Text readable
  </verify>
  <done>Мобильные layout исправлены</done>
</task>

<task type="auto">
  <name>Task 3: Optimize Touch Interactions</name>
  <files>
    - components/ui/button.tsx
    - components/product-card.tsx
    - components/forms/
  </files>
  <action>
    1. Button optimizations:
       - Min height 44px
       - Adequate padding
       - Touch feedback (:active)
    2. Card optimizations:
       - Touch area for click
       - Hover states for touch
    3. Form optimizations:
       - Larger input fields
       - Proper keyboard types
       - Date/number keyboards
    4. Add touch event handlers where needed
  </action>
  <verify>
    - Buttons easy to tap
    - Forms usable on mobile
    - Touch feedback visible
  </verify>
  <done>Тач-интерфейс оптимизирован</done>
</task>

<task type="auto">
  <name>Task 4: Test on Real Devices</name>
  <files>
    - All components
  </files>
  <action>
    1. Test on:
       - iOS Safari (iPhone)
       - Android Chrome
       - iPad/tablet
    2. Check:
       - Page load speed
       - Scroll performance
       - Form usability
       - Navigation smoothness
       - Font rendering
    3. Fix device-specific issues
  </action>
  <verify>
    - Tested on 2+ real devices
    - No critical issues
    - Performance acceptable
  </verify>
  <done>Тестирование на устройствах</done>
</task>

<task type="auto">
  <name>Task 5: Add Mobile-Specific Features</name>
  <files>
    - app/layout.tsx
    - components/layout/contact-bar.tsx
  </files>
  <action>
    1. Add mobile features:
       - Click-to-call buttons prominent
       - WhatsApp share button
       - Pull-to-refresh (if applicable)
       - Bottom sticky CTA (optional)
    2. Update contact-bar:
       - Large phone button
       - WhatsApp quick action
       - Bottom placement on mobile
    3. Ensure fast tap response
  </action>
  <verify>
    - Click-to-call works
    - WhatsApp opens
    - Quick actions visible
  </verify>
  <done>Мобильные фичи добавлены</done>
</task>

## Verification Criteria

1. **Breakpoints:** 320px+ работает
2. **Mobile-first:** CSS подход
3. **Touch:** Targets >= 44px
4. **Performance:** Fast on 3G
5. **Usability:** Формы удобны
6. **Features:** Click-to-call, WhatsApp

## Success Criteria
- [ ] Аудит адаптивности
- [ ] Layout исправления
- [ ] Touch оптимизации
- [ ] Тесты на реальных устройствах
- [ ] Мобильные фичи
