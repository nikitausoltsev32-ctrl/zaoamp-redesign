# AGENTS.md - AI Agent Documentation

> **Цель документа**: Предоставить AI-агентам (Cursor, GitHub Copilot, Claude, etc.) полный контекст проекта для эффективной работы над кодом.

## 📋 Оглавление

1. [Обзор проекта](#обзор-проекта)
2. [Технологический стек](#технологический-стек)
3. [Архитектура проекта](#архитектура-проекта)
4. [Стиль кода и конвенции](#стиль-кода-и-конвенции)
5. [Компоненты и паттерны](#компоненты-и-паттерны)
6. [Данные и контент](#данные-и-контент)
7. [Дизайн-система](#дизайн-система)
8. [Инструкции для AI](#инструкции-для-ai)
9. [Интеграция Dellin API](#интеграция-dellin-api)

---

## Обзор проекта

**Название**: zaoamp-redesign  
**Тип**: Корпоративный B2B сайт  
**Клиент**: ЗАО АМП (производитель мраморной крошки и щебня)  
**Цель**: Редизайн устаревшего сайта zaoamp.ru с современным стеком технологий

### Ключевые требования

- ✅ Современный дизайн (не скучный корпоратив)
- ✅ SEO-оптимизация
- ✅ Быстрая загрузка (Next.js SSR)
- ✅ Адаптивность (mobile-first)
- ✅ Калькулятор стоимости
- ✅ Форма заявки с валидацией
- ✅ Интеграция с мессенджерами (WhatsApp, Telegram)

---

## Технологический стек

### Core

```json
{
  "framework": "Next.js 14.1.0 (App Router)",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS 3.4.1",
  "ui-library": "shadcn/ui (Radix UI primitives)"
}
```

### Библиотеки

- **Анимации**: `framer-motion@^11.0.0`
- **Формы**: `react-hook-form@^7.49.3` + `zod@^3.22.4`
- **Иконки**: `lucide-react@^0.312.0`
- **Карты**: `react-leaflet@^4.2.1` + `leaflet@^1.9.4`
- **Утилиты**: `clsx`, `tailwind-merge`, `class-variance-authority`

### Конфигурация

**Next.js**: App Router (не Pages Router!)  
**TypeScript**: Strict mode включен  
**Tailwind**: CSS Variables для темизации  
**shadcn/ui**: Base color `stone`, стиль `default`

---

## Архитектура проекта

```
zaoamp-redesign/
├── .planning/              # 📁 Документация и планирование
│   ├── CONTEXT.md         # Контекст проекта (locked decisions)
│   ├── ROADMAP.md         # Дорожная карта разработки
│   └── phases/            # Детальные планы по фазам
├── app/                   # 📁 Next.js App Router
│   ├── layout.tsx         # Root layout (Header, Footer)
│   ├── page.tsx           # Главная страница
│   ├── about/             # О компании
│   ├── catalog/           # Каталог продукции
│   ├── contacts/          # Контакты
│   ├── delivery/          # Доставка
│   └── product/[slug]/    # Динамические страницы продуктов
├── components/            # 📁 React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   ├── layout/           # Header, Footer, Nav
│   ├── sections/         # Секции страниц
│   └── [feature].tsx     # Функциональные компоненты
├── lib/                   # 📁 Утилиты и данные
│   ├── data/             # Статические данные
│   └── utils/            # Вспомогательные функции
├── public/                # 📁 Статические файлы
│   ├── images/           # Изображения продукции
│   └── logo.png          # Логотип
├── types/                 # 📁 TypeScript типы
└── [0-1, 0-5, ...]/      # 📁 Фото фракций материала
```

### Структура страниц

| Страница | Route | Компоненты |
|----------|-------|------------|
| Главная | `/` | Hero, Benefits, FeaturedProducts, Calculator, CTA |
| Каталог | `/catalog` | CatalogHeader, CatalogFilters, CatalogGrid |
| Продукт | `/product/[slug]` | ProductHero, ProductSpecs, ProductApplications, ProductCalculator, ProductCTA |
| О компании | `/about` | Company info, history |
| Контакты | `/contacts` | ContactForm, Map (Leaflet) |
| Доставка | `/delivery` | Delivery terms, geography |

---

## Стиль кода и конвенции

### Именование файлов

```typescript
// ✅ Правильно
components/product-card.tsx        // kebab-case для файлов
components/sections/hero.tsx       // без префикса компонента в имени файла
lib/utils/products.ts              // kebab-case для утилит

// ❌ Неправильно
components/ProductCard.tsx         // PascalCase для файлов
components/sections/HeroSection.tsx // лишний суффикс
lib/utils/productsUtils.ts         // camelCase для файлов
```

### Именование компонентов

```typescript
// ✅ Правильно - PascalCase для компонентов
export function ProductCard() { ... }
export function HeroSection() { ... }

// ✅ Правильно - camelCase для функций/переменных
const calculatePrice = () => { ... }
const productData = { ... }

// ❌ Неправильно
export function product_card() { ... }  // snake_case
export function productcard() { ... }   // lowercase
```

### Client vs Server Components

```typescript
// ✅ Server Component (default) - без директивы
export function ProductCard({ product }: Props) {
  return <Card>...</Card>
}

// ✅ Client Component - используй только когда нужно
'use client'

export function HeroSlider() {
  const [index, setIndex] = useState(0) // hooks
  return <motion.div>...</motion.div>   // framer-motion
}
```

**Когда использовать `'use client'`:**
- useState, useEffect, useRef и другие hooks
- Event handlers (onClick, onChange, etc.)
- framer-motion анимации
- Browser APIs (localStorage, window, etc.)

### Импорты

```typescript
// ✅ Правильный порядок импортов
import { useState } from 'react'                    // 1. React
import { motion } from 'framer-motion'              // 2. External libs
import { Button } from '@/components/ui/button'     // 3. UI components
import { ProductCard } from '@/components'          // 4. Local components
import { products } from '@/lib/data/products'      // 5. Data/utils
import type { Product } from '@/types'              // 6. Types
```

### TypeScript

```typescript
// ✅ Используй интерфейсы для props
interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  onSelect?: (id: string) => void
}

// ✅ Используй type для unions/intersections
type ButtonVariant = 'default' | 'outline' | 'ghost'

// ✅ Экспортируй типы явно
export type { Product, ProductCardProps }
```

---

## Компоненты и паттерны

### shadcn/ui компоненты

**Установленные компоненты:**
- `Button` - кнопки (variants: default, outline, ghost, link)
- `Card` - карточки (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `Input` - поля ввода
- `Label` - лейблы для форм
- `Select` - выпадающие списки
- `Dialog` - модальные окна
- `Sheet` - боковые панели
- `Badge` - бейджи
- `Separator` - разделители
- `Textarea` - текстовые области

**Импорт:**
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
```

### Паттерн секций

```typescript
// components/sections/example-section.tsx
export function ExampleSection() {
  return (
    <section id="example" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          badge="Badge Text"
          title="Section Title"
          description="Section description"
        />
        {/* Content */}
      </div>
    </section>
  )
}
```

### Паттерн анимаций (framer-motion)

```typescript
'use client'

import { motion } from 'framer-motion'

// ✅ Простая анимация появления
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

// ✅ Staggered анимация для списков
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}
```

### Паттерн форм (react-hook-form + zod)

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +79123456789'),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  )
}
```

---

## Данные и контент

### Продукты (6 SKU)

```typescript
// lib/data/products.ts
export const products = [
  {
    id: 'muka-0-0-2',
    name: 'Мраморная мука',
    fraction: '0-0.2 мм',
    price: 4200,
    priceUnit: '₽/тонна',
    description: 'Мелкодисперсная фракция для производства лакокрасочных материалов',
    image: '/images/products/muka-0-0-2.jpg',
    applications: ['ЛКМ', 'Пластики', 'Резина'],
    specs: {
      whiteness: 98,
      purity: 98.5,
      humidity: 0.5
    }
  },
  // ... остальные 5 продуктов
]
```

### Контакты

```typescript
// lib/data/contacts.ts
export const contacts = {
  phone: '+7 (919) 393-19-92',
  email: 'evoprod@mail.ru',
  address: 'г. Екатеринбург, ул. Евгения Савкова 29, офис 262',
  telegram: '@usolst',
  whatsapp: '+79193931992',
  workHours: 'Пн-Пт: 9:00 - 18:00',
  coordinates: { lat: 56.8389, lng: 60.6057 } // Для карты
}
```

### Навигация

```typescript
// lib/data/navigation.ts
export const navigation = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О компании' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/contacts', label: 'Контакты' },
]
```

---

## Дизайн-система

### Цветовая палитра

```typescript
// tailwind.config.ts
colors: {
  brand: {
    orange: '#FF6B35',  // Основной акцент (CTA, ссылки)
    gold: '#FFB627',    // Вторичный акцент
  },
  // shadcn stone palette
  stone: { ... }
}
```

**Использование:**
- **Orange**: Кнопки CTA, активные элементы, hover-эффекты
- **Gold**: Вторичные акценты, бейджи премиум-качества
- **Stone**: Основная палитра (текст, фоны, границы)

### Типографика

```css
/* app/globals.css */
body {
  font-family: var(--font-sans); /* Inter или system-ui */
}

h1, h2, h3 {
  font-family: var(--font-serif); /* Playfair Display или Georgia */
}
```

**Иерархия:**
- `h1`: Hero заголовки (text-4xl lg:text-6xl)
- `h2`: Заголовки секций (text-3xl lg:text-5xl)
- `h3`: Подзаголовки (text-2xl lg:text-3xl)
- `p`: Основной текст (text-base lg:text-lg)

### Spacing

```typescript
// Стандартные отступы для секций
<section className="py-16 md:py-24">  // Вертикальные отступы
  <div className="container mx-auto px-4 sm:px-6 lg:px-8"> // Container
    {/* Content */}
  </div>
</section>
```

### Анимации

```css
/* Стандартные transition durations */
transition-all duration-300  /* Hover эффекты */
transition-all duration-500  /* Плавные изменения */
transition-all duration-1000 /* Длинные анимации */

/* Easing functions */
ease-in-out  /* По умолчанию */
ease-out     /* Для появления элементов */
ease-in      /* Для исчезновения элементов */
```

---

## Инструкции для AI

### При создании нового компонента

1. **Проверь существующие паттерны** в `components/`
2. **Используй shadcn/ui** для базовых UI элементов
3. **Следуй структуре секций** для страничных компонентов
4. **Добавь TypeScript типы** для всех props
5. **Используй `'use client'`** только когда необходимо
6. **Соблюдай responsive дизайн** (mobile-first)
7. **Добавь accessibility** (aria-labels, semantic HTML)

### При работе со стилями

1. **Используй Tailwind утилиты** вместо custom CSS
2. **Используй CSS Variables** для цветов темы
3. **Соблюдай spacing систему** (py-16 md:py-24)
4. **Используй container класс** для ограничения ширины
5. **Добавь hover/focus состояния** для интерактивных элементов

### При работе с данными

1. **Храни статические данные** в `lib/data/`
2. **Экспортируй typed константы** из data файлов
3. **Используй TypeScript интерфейсы** для структуры данных
4. **Не дублируй данные** - создай single source of truth

### При работе с формами

1. **Используй react-hook-form + zod** для всех форм
2. **Валидируй на клиенте** перед отправкой
3. **Показывай понятные ошибки** на русском языке
4. **Добавь loading состояния** для submit
5. **Обработай success/error** состояния

### При оптимизации

1. **Используй Next.js Image** для всех изображений
2. **Добавь `priority`** для above-the-fold изображений
3. **Ленивая загрузка** для below-the-fold контента
4. **Code splitting** через dynamic imports когда нужно
5. **Минимизируй Client Components** для лучшей производительности

### При работе с SEO

1. **Добавь metadata** в каждый layout/page
2. **Используй semantic HTML** (header, nav, main, section, article)
3. **Добавь alt текст** для всех изображений
4. **Структурированные данные** (JSON-LD) для продуктов
5. **Canonical URLs** для избежания дублей

---

## Примеры кода

### Создание новой страницы

```typescript
// app/new-page/page.tsx
import { Metadata } from 'next'
import { SomeSection } from '@/components/sections/some-section'

export const metadata: Metadata = {
  title: 'Page Title | ZAOAMP',
  description: 'Page description for SEO',
}

export default function NewPage() {
  return (
    <main>
      <SomeSection />
    </main>
  )
}
```

### Создание новой секции

```typescript
// components/sections/new-section.tsx
import { SectionHeader } from '@/components/section-header'
import { Button } from '@/components/ui/button'

export function NewSection() {
  return (
    <section id="new-section" className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Новая секция"
          title="Заголовок секции"
          description="Описание секции для пользователей"
        />
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Grid content */}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button size="lg" className="bg-brand-orange">
            Call to Action
          </Button>
        </div>
      </div>
    </section>
  )
}
```

### Создание нового UI компонента

```typescript
// components/custom-card.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface CustomCardProps {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}

export function CustomCard({ icon: Icon, title, description, children }: CustomCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10">
          <Icon className="h-6 w-6 text-brand-orange" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
```

---

## Команды разработки

```bash
# Разработка
npm run dev              # Запуск dev сервера (localhost:3000)
npm run build            # Production build
npm run start            # Запуск production сервера
npm run lint             # ESLint проверка
npm run type-check       # TypeScript проверка

# Git workflow
git pull origin main     # Получить изменения
git add .
git commit -m "message"
git push origin main     # Отправить изменения
```

---

## Полезные ссылки

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

**Последнее обновление**: 10 февраля 2026  

---

## Интеграция Dellin API

### Обзор

Проект использует API «Деловых Линий» (Dellin) для расчёта стоимости и сроков доставки мраморной крошки клиентам.

**Базовый URL**: `https://api.dellin.ru`
**Формат**: REST API, JSON
**Кодировка**: UTF-8

### Endpoints

#### 1. Авторизация

```http
POST /v1/customers/login
```

**Назначение**: Получение `sessionID` для доступа к персональным условиям (скидки, история заказов).

**Параметры запроса**:

```typescript
interface LoginRequest {
  appkey: string;        // Ключ приложения (required)
  login: string;         // Телефон в формате +7XXXXXXXXXX (required)
  password: string;      // Пароль от ЛК (required)
}
```

**Пример запроса**:

```json
{
  "appkey": "YOUR_APP_KEY",
  "login": "+79991234567",
  "password": "yourPassword"
}
```

**Успешный ответ**:

```typescript
interface LoginResponse {
  success: true;
  sessionID: string;     // Токен сессии
  metadata: object;
}
```

**Ошибки**:
- `400` - Неверный формат логина/пароля, отсутствуют поля
- `401`/`403` - Неверные учетные данные

---

#### 2. Калькулятор стоимости и сроков

```http
POST /v2/calculator
```

**Назначение**: Расчёт стоимости доставки и минимальных сроков.

**Основные параметры**:

```typescript
interface CalculatorRequest {
  appkey: string;                    // Ключ приложения (required)
  sessionID?: string;                // Токен сессии (optional)
  delivery: DeliveryParams;          // Параметры доставки (required)
  cargo: CargoParams;                // Параметры груза (required)
  members?: MembersParams;           // Стороны перевозки (optional)
  payment?: PaymentParams;           // Параметры оплаты (optional)
}

interface DeliveryParams {
  deliveryType: {
    type: string;                    // Тип перевозки (автоперевозка и др.)
  };
  derival: DerivalArrival;           // Параметры отправления
  arrival: DerivalArrival;           // Параметры прибытия
}

interface DerivalArrival {
  produceDate?: string;              // Дата сдачи груза (YYYY-MM-DD)
  variant: string;                   // "terminal" | "address"
  terminalID?: string;               // ID терминала
  addressID?: number;                // ID адреса из адресной книги
  address?: {
    search?: string;                 // Текстовый адрес или "lat,lon"
    street?: string;
    house?: string;
  };
  city?: string;                     // Код города (КЛАДР)
}

interface CargoParams {
  totalVolume?: number;              // Общий объем (м³)
  totalWeight: number;               // Общий вес (кг)
  // Дополнительные параметры габаритов при необходимости
}
```

**Пример минимального запроса**:

```json
{
  "appkey": "YOUR_APP_KEY",
  "delivery": {
    "deliveryType": {
      "type": "auto"
    },
    "derival": {
      "produceDate": "2026-02-15",
      "variant": "terminal",
      "terminalID": "ekb-terminal-1"
    },
    "arrival": {
      "variant": "address",
      "address": {
        "search": "Москва, ул. Ленина, 10"
      }
    }
  },
  "cargo": {
    "totalVolume": 0.5,
    "totalWeight": 500
  }
}
```

**Ответ**:

Возвращает стоимость, НДС, минимальные/максимальные сроки доставки.

---

#### 3. Доступные даты доставки

```http
POST /v1/public/delivery_dates
```

**Назначение**: Получить список доступных дат и временных интервалов для забора/доставки груза.

**Параметры**: Аналогичны параметрам адреса из `DerivalArrival`.

---

### Обработка ошибок

**Формат ошибки**:

```typescript
interface ErrorResponse {
  errors: Array<{
    code: string;                    // Код ошибки
    field?: string;                  // Поле с ошибкой
    message: string;                 // Описание ошибки
  }>;
}
```

**HTTP коды**:
- `400` - Ошибка валидации: неверный формат данных, отсутствуют обязательные поля, некорректный тип
- `401`/`403` - Проблемы с авторизацией
- `500+` - Внутренние ошибки сервера Dellin

**Типичные причины 400**:
1. Неверный тип данных параметра (число вместо строки)
2. Отсутствует обязательный параметр
3. Некорректный формат поля (телефон, дата, адрес)
4. Неверный формат логина (должен быть `+7XXXXXXXXXX`)

**Что делать при ошибке**:
1. Логировать **полное тело запроса** и **полное тело ответа**
2. Проверить типы данных всех параметров
3. Сверить с документацией формат обязательных полей
4. Убедиться, что отправляется валидный JSON с правильным `Content-Type: application/json`

---

### Реализация в проекте

#### Структура файлов

```
lib/
├── api/
│   ├── dellin.ts              # Клиент Dellin API
│   └── dellin-types.ts        # TypeScript типы для API
├── data/
│   └── delivery.ts            # Данные о терминалах и регионах
components/
└── calculator.tsx             # Компонент калькулятора доставки
```

#### Пример клиента API

```typescript
// lib/api/dellin.ts
import type { CalculatorRequest, CalculatorResponse } from './dellin-types';

const DELLIN_API_BASE = 'https://api.dellin.ru';
const DELLIN_APP_KEY = process.env.NEXT_PUBLIC_DELLIN_APP_KEY;

export class DellinAPI {
  private sessionID?: string;

  async login(login: string, password: string) {
    const response = await fetch(`${DELLIN_API_BASE}/v1/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appkey: DELLIN_APP_KEY,
        login,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Dellin login failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    this.sessionID = data.sessionID;
    return data;
  }

  async calculateDelivery(params: Omit<CalculatorRequest, 'appkey'>) {
    const response = await fetch(`${DELLIN_API_BASE}/v2/calculator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appkey: DELLIN_APP_KEY,
        sessionID: this.sessionID,
        ...params,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Dellin API error:', error);
      throw new Error(`Dellin calculation failed: ${JSON.stringify(error)}`);
    }

    return await response.json() as CalculatorResponse;
  }
}

// Singleton instance
export const dellinAPI = new DellinAPI();
```

#### Пример использования в компоненте

```typescript
// components/calculator.tsx
'use client';

import { useState } from 'react';
import { dellinAPI } from '@/lib/api/dellin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DeliveryCalculator() {
  const [weight, setWeight] = useState(500);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dellinAPI.calculateDelivery({
        delivery: {
          deliveryType: { type: 'auto' },
          derival: {
            produceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            variant: 'terminal',
            terminalID: 'ekb-terminal-1',
          },
          arrival: {
            variant: 'address',
            address: { search: address },
          },
        },
        cargo: {
          totalWeight: weight,
          totalVolume: weight / 1000, // Примерный расчет объема
        },
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка расчёта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Вес груза (кг)"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
      />
      <Input
        type="text"
        placeholder="Адрес доставки"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button onClick={handleCalculate} disabled={loading}>
        {loading ? 'Расчёт...' : 'Рассчитать стоимость'}
      </Button>

      {error && (
        <div className="text-red-600">{error}</div>
      )}

      {result && (
        <div className="space-y-2">
          <p>Стоимость: {result.price} ₽</p>
          <p>Срок доставки: {result.deliveryTime} дней</p>
        </div>
      )}
    </div>
  );
}
```

---

### Environment Variables

Добавь в `.env.local`:

```bash
NEXT_PUBLIC_DELLIN_APP_KEY=your_app_key_here
DELLIN_LOGIN=+79991234567  # Опционально для server-side
DELLIN_PASSWORD=password    # Опционально для server-side
```

⚠️ **Важно**: Не коммить `.env.local` в Git!

---

### Полезные ссылки

- [Официальная документация Dellin API](https://dev.dellin.ru/)
- [Калькулятор стоимости](https://dev.dellin.ru/api/calculation/)
- [Авторизация](https://dev.dellin.ru/api/auth/login/)
- [Справочники](https://dev.dellin.ru/api/catalogs/)

---
**Версия**: 1.0.0  
**Автор**: nikitausoltsev32-ctrl
