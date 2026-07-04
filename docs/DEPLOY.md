# Деплой на reg.ru VPS (Docker)

## Требования
- VPS: Ubuntu 22.04+, от 2 ГБ RAM (сборка Next.js прожорлива; на 1 ГБ добавить swap).
- Домен amp-minerals.ru.

## 1. DNS
В панели управления доменом создать A-записи, указывающие на IP VPS:
- `amp-minerals.ru` → IP
- `www.amp-minerals.ru` → IP

Дождаться обновления DNS (проверка: `nslookup amp-minerals.ru`).

## 2. Установка Docker на VPS
```bash
curl -fsSL https://get.docker.com | sh
```

## 3. Код и переменные окружения
```bash
git clone <репозиторий> /opt/amp && cd /opt/amp
cp .env.example .env
nano .env   # заполнить TELEGRAM_*, RESEND_*, DELLIN_API_KEY и т.д.
```

## 4. Запуск
```bash
docker compose up -d --build
```
Caddy сам получит сертификат Let's Encrypt для amp-minerals.ru и www
(нужно, чтобы DNS уже указывал на VPS и порты 80/443 были открыты).

## 5. Проверка
```bash
docker compose ps            # оба контейнера Up
docker compose logs app      # без ошибок
curl -I https://amp-minerals.ru/
```

## Обновление сайта
```bash
cd /opt/amp && git pull && docker compose up -d --build
```

## Откат
```bash
git checkout <прошлый-коммит> && docker compose up -d --build
```
