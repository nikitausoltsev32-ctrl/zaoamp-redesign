# Phase 04, Plan 03: Telegram Integration

## Metadata
```yaml
phase: "04"
plan: "03"
wave: 4
depends_on: ["04-02"]
files_modified:
  - lib/integrations/telegram.ts
  - app/api/telegram/route.ts
autonomous: false
```

## Objective
Настроить интеграцию с Telegram Bot для отправки уведомлений о новых заявках.

## must_haves
```yaml
truths:
  - "API роут для отправки сообщений в Telegram"
  - "Форматированное сообщение с данными заявки"
  - "Обработка ошибок отправки"
  - "Формы используют API для отправки"
  - "Логирование успешных/неуспешных отправок"

artifacts:
  - path: "lib/integrations/telegram.ts"
    provides: "Клиент Telegram API"
    min_lines: 60
  - path: "app/api/telegram/route.ts"
    provides: "API роут для отправки"
    min_lines: 50
  - path: ".env.local"
    provides: "Переменные окружения"
    min_lines: 10

key_links:
  - from: "app/api/telegram/route.ts"
    to: "lib/integrations/telegram.ts"
    via: "import { sendTelegramMessage }"
  - from: "components/forms/quick-order-form.tsx"
    to: "/api/telegram"
    via: "fetch POST"
```

## Tasks

<task type="auto">
  <name>Task 1: Create Telegram Client</name>
  <files>
    - lib/integrations/telegram.ts
  </files>
  <action>
    1. Create lib/integrations/telegram.ts:
       - Function: sendTelegramMessage(message: string, chatId?: string)
       - Use fetch to Telegram Bot API
       - BOT_TOKEN from env
       - Default CHAT_ID from env
       - Error handling with retries
       - Return success/failure status
    2. Create formatters:
       - formatOrderMessage(data: OrderFormData): string
       - formatContactMessage(data: ContactFormData): string
  </action>
  <verify>
    - Client exports functions
    - Message formatting works
    - Error handling implemented
  </verify>
  <done>Telegram клиент создан</done>
</task>

<task type="auto">
  <name>Task 2: Create API Route</name>
  <files>
    - app/api/telegram/route.ts
  </files>
  <action>
    1. Create app/api/telegram/route.ts:
       - POST handler
       - Validate request body
       - Call sendTelegramMessage
       - Return JSON response
       - Handle errors gracefully
    2. Security:
       - Rate limiting consideration
       - Basic validation
       - No sensitive data exposure
  </action>
  <verify>
    - API responds to POST
    - Validation works
    - Message sent to Telegram
    - Error responses correct
  </verify>
  <done>API роут создан</done>
</task>

<task type="auto">
  <name>Task 3: Connect Forms to Telegram</name>
  <files>
    - components/forms/quick-order-form.tsx
    - components/forms/contact-form.tsx
  </files>
  <action>
    1. Update form submit handlers:
       - On submit, call /api/telegram
       - Send formatted form data
       - Show loading state during API call
       - Show success/error based on response
    2. Error handling:
       - Network errors
       - Validation errors
       - Telegram API errors
    3. Success flow:
       - Show success message
       - Reset form
       - Optional: redirect
  </action>
  <verify>
    - Form submit calls API
    - Telegram receives message
    - Success/error feedback works
    - Form resets on success
  </verify>
  <done>Формы подключены к Telegram</done>
</task>

<task type="auto">
  <name>Task 4: Configure Environment Variables</name>
  <files>
    - .env.local
    - .env.example
  </files>
  <action>
    1. Create .env.local:
       - TELEGRAM_BOT_TOKEN=your_bot_token
       - TELEGRAM_CHAT_ID=your_chat_id
    2. Create .env.example (template without real values)
    3. Document setup in README
    4. Add .env.local to .gitignore
  </action>
  <verify>
    - .env.local not in git
    - .env.example exists
    - App reads env vars
  </verify>
  <done>Переменные окружения настроены</done>
</task>

## Verification Criteria

1. **Клиент:** Отправляет сообщения в Telegram
2. **API роут:** Обрабатывает POST запросы
3. **Формы:** Отправляют данные в Telegram
4. **Форматирование:** Читаемые сообщения
5. **Ошибки:** Обрабатываются корректно
6. **Env vars:** Не в git, задокументированы

## Success Criteria
- [ ] Telegram клиент
- [ ] API роут /api/telegram
- [ ] Формы отправляют сообщения
- [ ] Форматирование сообщений
- [ ] Обработка ошибок
- [ ] Env vars настроены

## Note
Требуется настройка Telegram Bot:
1. Создать бота через @BotFather
2. Получить BOT_TOKEN
3. Добавить бота в чат
4. Получить CHAT_ID
