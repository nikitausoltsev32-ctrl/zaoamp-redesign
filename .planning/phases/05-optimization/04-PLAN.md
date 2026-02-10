# Phase 05, Plan 04: Deployment

## Metadata
```yaml
phase: "05"
plan: "04"
wave: 5
depends_on: ["05-03"]
files_modified:
  - .github/workflows/
  - next.config.js
autonomous: false
```

## Objective
Подготовить сайт к деплою: production build, домен, SSL, аналитика, мониторинг.

## must_haves
```yaml
truths:
  - "Production build создаётся без ошибок"
  - "Сайт доступен на домене"
  - "SSL сертификат настроен"
  - "Аналитика подключена (Яндекс.Метрика)"
  - "Robots и Sitemap доступны"

artifacts:
  - path: ".github/workflows/deploy.yml"
    provides: "CI/CD pipeline"
    min_lines: 40
  - path: "next.config.js"
    provides: "Production конфигурация"
    min_lines: 30
  - path: "public/.htaccess"
    provides: "Apache redirects"
    min_lines: 20

key_links:
  - from: ".github/workflows/deploy.yml"
    to: "Hosting server"
    via: "SSH/SCP deployment"
```

## Tasks

<task type="auto">
  <name>Task 1: Prepare Production Build</name>
  <files>
    - next.config.js
    - package.json
  </files>
  <action>
    1. Verify next.config.js:
       - output: 'export'
       - distDir: 'dist'
       - trailingSlash: true (for static hosting)
    2. Test production build:
       - npm run build
       - Check dist/ folder
       - Verify all pages generated
       - Check for console errors
    3. Optimize assets:
       - Verify images copied
       - Check font files
  </action>
  <verify>
    - Build succeeds
    - dist/ contains all files
    - No 404 on main pages
  </verify>
  <done>Production build готов</done>
</task>

<task type="auto">
  <name>Task 2: Setup Domain and Hosting</name>
  <files>
    - Hosting configuration
  </files>
  <action>
    1. Domain setup:
       - zaoamp.ru (existing)
       - www.zaoamp.ru redirect
       - SSL certificate (Let's Encrypt or hosting)
    2. Hosting options:
       - Vercel (recommended for Next.js)
       - Netlify
       - Traditional hosting (Apache/Nginx)
    3. Configure DNS:
       - A records
       - CNAME for www
  </action>
  <verify>
    - Domain resolves
    - HTTPS works
    - www redirects
  </verify>
  <done>Домен и хостинг настроены</done>
</task>

<task type="auto">
  <name>Task 3: Configure Analytics</name>
  <files>
    - app/layout.tsx
    - components/analytics/
  </files>
  <action>
    1. Add Yandex.Metrika:
       - Get counter ID
       - Add script to layout
       - Configure goals:
         - Form submission
         - Phone click
         - WhatsApp click
         - Calculator use
    2. Optional: Google Analytics 4
    3. Create analytics components:
       - YandexMetrika.tsx
       - Goal tracking hooks
  </action>
  <verify>
    - Counter loads
    - Goals configured
    - Data appears in dashboard
  </verify>
  <done>Аналитика настроена</done>
</task>

<task type="auto">
  <name>Task 4: Create CI/CD Pipeline</name>
  <files>
    - .github/workflows/deploy.yml
  </files>
  <action>
    1. Create GitHub Actions workflow:
       - Trigger: push to main
       - Steps:
         - Checkout code
         - Setup Node.js
         - Install dependencies
         - Run build
         - Deploy to hosting
       - Deployment:
         - Vercel: vercel --prod
         - Netlify: netlify deploy
         - FTP/SFTP: ssh/scp commands
    2. Add environment variables to GitHub Secrets
    3. Test pipeline
  </action>
  <verify>
    - Pipeline runs on push
    - Build succeeds
    - Deploy completes
    - Site updated
  </verify>
  <done>CI/CD pipeline создан</done>
</task>

<task type="auto">
  <name>Task 5: Final Testing and Launch</name>
  <files>
    - All site files
  </files>
  <action>
    1. Pre-launch checklist:
       - [ ] All pages load
       - [ ] Forms submit
       - [ ] Telegram notifications work
       - [ ] Links work
       - [ ] Images load
       - [ ] Mobile responsive
       - [ ] Analytics tracking
       - [ ] SEO meta correct
       - [ ] SSL certificate valid
       - [ ] 404 page exists
    2. Soft launch:
       - Deploy to production
       - Test all functionality
       - Check analytics
    3. Hard launch:
       - Update DNS if needed
       - Announce
  </action>
  <verify>
    - All checks pass
    - Site live on domain
    - Everything works
  </verify>
  <done>Сайт запущен</done>
</task>

## Verification Criteria

1. **Build:** Production build succeeds
2. **Domain:** Site accessible on zaoamp.ru
3. **SSL:** HTTPS works
4. **Analytics:** Метрика считает
5. **CI/CD:** Автодеплой работает
6. **Launch:** Сайт в продакшене

## Success Criteria
- [ ] Production build
- [ ] Домен и SSL
- [ ] Яндекс.Метрика
- [ ] CI/CD pipeline
- [ ] Финальное тестирование
- [ ] Запуск сайта

## Note
Требуется:
- Доступ к DNS домена zaoamp.ru
- Доступ к хостингу
- Yandex.Metrika counter ID
- Telegram Bot token (уже должен быть)
