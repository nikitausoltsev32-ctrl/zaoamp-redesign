# Phase 04, Plan 01: Calculator Component

## Metadata
```yaml
phase: "04"
plan: "01"
wave: 4
depends_on: ["03-01"]
files_modified:
  - components/calculator.tsx
  - lib/utils/calculator.ts
autonomous: true
```

## Objective
Создать калькулятор стоимости для расчёта цены продукции с учётом объёма, упаковки и доставки.

## must_haves
```yaml
truths:
  - "Калькулятор принимает объём (тонны)"
  - "Калькулятор учитывает фракцию продукта"
  - "Калькулятор включает стоимость упаковки"
  - "Калькулятор рассчитывает доставку по региону"
  - "Результат отображается в реальном времени"

artifacts:
  - path: "components/calculator.tsx"
    provides: "Калькулятор компонент"
    min_lines: 150
  - path: "lib/utils/calculator.ts"
    provides: "Логика расчётов"
    min_lines: 60
  - path: "lib/data/calculator.ts"
    provides: "Данные для расчётов"
    min_lines: 50

key_links:
  - from: "components/calculator.tsx"
    to: "lib/utils/calculator.ts"
    via: "import { calculatePrice }"
  - from: "components/calculator.tsx"
    to: "lib/data/calculator.ts"
    via: "import { deliveryRates, packagingCosts }"
  - from: "app/page.tsx"
    to: "components/calculator.tsx"
    via: "Calculator in Hero or separate section"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Calculator Data</name>
  <files>
    - lib/data/calculator.ts
  </files>
  <action>
    1. Create lib/data/calculator.ts:
       - deliveryRates: {
           'ekaterinburg': { base: 1500, perKm: 0 },
           'ural': { base: 3000, perKm: 50 },
           'moscow': { base: 18000, perKm: 0 },
           'railway': { base: 0, perKm: 3 }
         }
       - packagingCosts: {
           'bulk': 0,
           'bigbag': 120,
           'bag50': 35,
           'bag25': 25
         }
       - minOrderVolume: 1 (ton)
       - bulkDiscount: { min: 20, discount: 0.05 } (5% от 20т)
  </action>
  <verify>
    - All rates match ТЗ
    - TypeScript interfaces defined
    - Data exported correctly
  </verify>
  <done>Данные для калькулятора созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create Calculator Logic</name>
  <files>
    - lib/utils/calculator.ts
  </files>
  <action>
    1. Create lib/utils/calculator.ts:
       - Interfaces: CalculatorInput, CalculatorResult
       - calculateProductCost(productId, volume): number
       - calculatePackagingCost(volume, packagingType): number
       - calculateDeliveryCost(region, volume): number
       - calculateTotal(input: CalculatorInput): CalculatorResult
       - applyDiscount(volume, baseCost): number
       - formatPrice(price): string ("3 500 ₽")
    2. Handle edge cases:
       - Volume < 1 (show minimum order warning)
       - Invalid product (return 0)
  </action>
  <verify>
    - Unit tests for calculation functions
    - Edge cases handled
    - TypeScript types strict
  </verify>
  <done>Логика расчётов реализована</done>
</task>

<task type="auto">
  <name>Task 3: Create Calculator Component UI</name>
  <files>
    - components/calculator.tsx
  </files>
  <action>
    1. Create components/calculator.tsx:
       - Props: preselectedProduct?: string, compact?: boolean
       - State: volume, product, packaging, region
       - Form inputs:
         - Product Select (or hidden if preselected)
         - Volume Input (number, step=0.5, min=1)
         - Packaging Select (bulk, bigbag, bag50, bag25)
         - Region Select (ekaterinburg, ural, moscow, railway)
       - Real-time calculation display:
         - Стоимость продукции
         - Стоимость упаковки
         - Стоимость доставки
         - Итого
       - Visual: progress bars or breakdown
       - CTA: "Оставить заявку" -> open order form
  </action>
  <verify>
    - Form inputs work correctly
    - Calculation updates on change
    - Preselected product works
    - CTA button visible
  </verify>
  <done>UI калькулятора создан</done>
</task>

<task type="auto">
  <name>Task 4: Add Calculator to Home Page</name>
  <files>
    - app/page.tsx
    - components/sections/calculator-section.tsx
  </files>
  <action>
    1. Create components/sections/calculator-section.tsx:
       - SectionHeader: "Рассчитайте стоимость"
       - Subtitle: "Онлайн-калькулятор с учётом доставки"
       - Include Calculator component
       - Background: subtle accent or white
    2. Update app/page.tsx:
       - Add CalculatorSection after Hero or Benefits
       - Ensure it stands out visually
  </action>
  <verify>
    - Calculator visible on home page
    - Section styled appropriately
    - Responsive layout
  </verify>
  <done>Калькулятор добавлен на главную</done>
</task>

## Verification Criteria

1. **Расчёт продукта:** Цена × объём
2. **Расчёт упаковки:** Правильная стоимость
3. **Расчёт доставки:** По региону
4. **Скидки:** Применяются от 20т
5. **Форматирование:** "3 500 ₽"
6. **Реальное время:** Обновление при изменении

## Success Criteria
- [ ] Данные для расчётов
- [ ] Логика calculateTotal
- [ ] UI компонент Calculator
- [ ] Интеграция на главную
- [ ] Preselected product работает
- [ ] Все цены из ТЗ
