# Phase 04, Plan 02: Forms & Validation

## Metadata
```yaml
phase: "04"
plan: "02"
wave: 4
depends_on: ["04-01"]
files_modified:
  - components/forms/
  - lib/validation/
autonomous: true
```

## Objective
Создать формы для лидогенерации: быстрая заявка, обратный звонок, форма на странице контактов с валидацией.

## must_haves
```yaml
truths:
  - "Формы валидируются с помощью zod"
  - "Телефон маскируется при вводе"
  - "Отображается состояние загрузки"
  - "Успешная отправка показывает подтверждение"
  - "Ошибки отображаются под полями"

artifacts:
  - path: "lib/validation/order-schema.ts"
    provides: "Схема валидации заказа"
    min_lines: 30
  - path: "lib/validation/contact-schema.ts"
    provides: "Схема валидации контактной формы"
    min_lines: 25
  - path: "components/forms/quick-order-form.tsx"
    provides: "Форма быстрого заказа"
    min_lines: 80
  - path: "components/forms/callback-form.tsx"
    provides: "Форма обратного звонка"
    min_lines: 60
  - path: "components/forms/order-dialog.tsx"
    provides: "Модальное окно заказа"
    min_lines: 50
  - path: "components/ui/phone-input.tsx"
    provides: "Поле ввода телефона с маской"
    min_lines: 40

key_links:
  - from: "components/forms/quick-order-form.tsx"
    to: "lib/validation/order-schema.ts"
    via: "import { orderSchema }"
  - from: "components/forms/quick-order-form.tsx"
    to: "components/ui/phone-input.tsx"
    via: "import { PhoneInput }"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Validation Schemas</name>
  <files>
    - lib/validation/order-schema.ts
    - lib/validation/contact-schema.ts
  </files>
  <action>
    1. Create lib/validation/order-schema.ts:
       - name: string, min 2 chars
       - phone: string, format +7 (XXX) XXX-XX-XX
       - email: string, email, optional
       - product: string (product id or 'unknown')
       - volume: number, min 1
       - message: string, optional
       - consent: boolean, must be true
    2. Create lib/validation/contact-schema.ts:
       - name: string, min 2 chars
       - phone: string, format +7 (XXX) XXX-XX-XX
       - email: string, email, optional
       - subject: enum ['consultation', 'order', 'partnership', 'other']
       - message: string, min 10 chars
       - consent: boolean, must be true
    3. Export types: OrderFormData, ContactFormData
  </action>
  <verify>
    - Schemas validate correctly
    - TypeScript types generated
    - Error messages in Russian
  </verify>
  <done>Схемы валидации созданы</done>
</task>

<task type="auto">
  <name>Task 2: Create PhoneInput Component</name>
  <files>
    - components/ui/phone-input.tsx
  </files>
  <action>
    1. Install: `npm install react-input-mask` или use regex
    2. Create components/ui/phone-input.tsx:
       - Props: value, onChange, error?, disabled?
       - Mask: +7 (999) 999-99-99
       - Placeholder: +7 (___) ___-__-__
       - Auto-focus on click
       - Format on blur
       - Error state styling
    3. Integrate with react-hook-form
  </action>
  <verify>
    - Mask works correctly
    - Only numbers allowed
    - Format preserved
    - Error state visible
  </verify>
  <done>Поле телефона с маской создано</done>
</task>

<task type="auto">
  <name>Task 3: Create QuickOrderForm Component</name>
  <files>
    - components/forms/quick-order-form.tsx
  </files>
  <action>
    1. Create components/forms/quick-order-form.tsx:
       - Use react-hook-form + zodResolver
       - Fields:
         - Name (text input)
         - Phone (PhoneInput)
         - Product (select, pre-filled if passed)
         - Volume (number input, default 1)
         - Consent checkbox
       - Submit handler with loading state
       - Success message after submit
       - Error handling
       - Reset form after success
  </action>
  <verify>
    - Form validates on submit
    - Phone mask works
    - Loading state shown
    - Success message displayed
  </verify>
  <done>Форма быстрого заказа создана</done>
</task>

<task type="auto">
  <name>Task 4: Create CallbackForm Component</name>
  <files>
    - components/forms/callback-form.tsx
  </files>
  <action>
    1. Create components/forms/callback-form.tsx:
       - Compact version for sidebars/modals
       - Fields:
         - Name (text input)
         - Phone (PhoneInput)
         - Consent checkbox
       - Inline layout (horizontal on desktop)
       - Quick submit
       - Immediate feedback
  </action>
  <verify>
    - Compact layout works
    - Validation works
    - Submits correctly
  </verify>
  <done>Форма обратного звонка создана</done>
</task>

<task type="auto">
  <name>Task 5: Create OrderDialog Component</name>
  <files>
    - components/forms/order-dialog.tsx
  </files>
  <action>
    1. Create components/forms/order-dialog.tsx:
       - Use Dialog from shadcn
       - Props: open, onOpenChange, preselectedProduct?
       - Content:
         - DialogHeader with title
         - QuickOrderForm inside
         - Pre-fill product if provided
       - Trigger can be any button
       - Close on success with delay
  </action>
  <verify>
    - Dialog opens/closes correctly
    - Form works inside dialog
    - Preselected product works
    - Closes after success
  </verify>
  <done>Модальное окно заказа создано</done>
</task>

<task type="auto">
  <name>Task 6: Integrate Forms Throughout Site</name>
  <files>
    - components/sections/cta-section.tsx
    - components/sections/product/product-cta.tsx
    - app/contacts/page.tsx
  </files>
  <action>
    1. Update CTA sections with OrderDialog trigger
    2. Add OrderDialog to product pages
    3. Update contacts page ContactForm with validation
    4. Add CallbackForm to sidebar (if exists) or footer
    5. Ensure all forms use consistent styling
  </action>
  <verify>
    - All CTAs open OrderDialog
    - Product CTA pre-fills product
    - Contact form validates
    - Consistent UX across forms
  </verify>
  <done>Формы интегрированы в сайт</done>
</task>

## Verification Criteria

1. **Валидация:** Zod схемы работают
2. **Маска телефона:** +7 (XXX) XXX-XX-XX
3. **Состояния:** Loading, success, error
4. **Формы:** QuickOrder, Callback, Contact
5. **Диалог:** OrderDialog работает
6. **Интеграция:** Все CTA открывают формы

## Success Criteria
- [ ] Схемы валидации (zod)
- [ ] PhoneInput с маской
- [ ] QuickOrderForm
- [ ] CallbackForm
- [ ] OrderDialog
- [ ] Интеграция во все CTA
