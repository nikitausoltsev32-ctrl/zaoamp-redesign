# SEO Daily Task for ЗАО АМП
# Запускается ежедневно в 9:00 MSK

$projectPath = "C:\Users\HomePc\.zaoamprepo\zaoamp-redesign"
$logFile = "$projectPath\seo-logs\daily-$(Get-Date -Format 'yyyy-MM-dd').log"

# Создаём папку для логов
if (!(Test-Path "$projectPath\seo-logs")) {
    New-Item -ItemType Directory -Path "$projectPath\seo-logs" | Out-Null
}

# Запускаем SEO-агента
Write-Host "Starting SEO audit at $(Get-Date)" | Tee-Object -FilePath $logFile

cd $projectPath

# Запускаем суб-агента для SEO-аудита
$output = claude --prompt @"
Выполни ежедневный SEO-аудит для amp-minerals.ru:

## Задачи:
1. Проверь технические ошибки (битые ссылки, 404, редиректы)
2. Проверь Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
3. Проверь Schema.org разметку на всех страницах
4. Найди новые возможности для контента
5. Сверься с claude-seo/IMPLEMENTATION-ROADMAP.md — какая следующая задача по плану?

## Формат отчёта:
- ✅ Что сделано сегодня
- ⚠️ Найденные проблемы
- 📋 Следующая задача из ROADMAP
- 🔗 Ссылки на изменённые файлы

Отправь этот отчёт пользователю.
"@ 2>&1

# Логируем вывод
$output | Tee-Object -FilePath $logFile -Append

Write-Host "SEO audit completed at $(Get-Date)" | Tee-Object -FilePath $logFile -Append
