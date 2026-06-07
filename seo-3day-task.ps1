# SEO 3-day driver for amp-minerals.ru
# Запуск раз в 3 дня. Агент берёт ОДНУ задачу из roadmap, делает её на отдельной
# ветке seo/auto-ДАТА и коммитит — ты ревьюишь diff и мержишь сам.
# Регистрация (раз, PowerShell от админа):
#   schtasks /Create /TN "AMP-SEO-3day" /TR "powershell -NoProfile -File C:\Users\HomePc\.zaoamprepo\zaoamp-redesign\seo-3day-task.ps1" /SC DAILY /MO 3 /ST 09:00

$ErrorActionPreference = 'Stop'
$project = "C:\Users\HomePc\.zaoamprepo\zaoamp-redesign"
$logDir  = "$project\seo-logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$date = Get-Date -Format 'yyyy-MM-dd'
$log  = "$logDir\3day-$date.log"
$branch = "seo/auto-$date"

Set-Location $project
"=== SEO 3-day run $(Get-Date) ===" | Tee-Object -FilePath $log

# Грязное дерево — не лезем, чтобы не смешать чужие правки с авто-правками
if (git status --porcelain) {
  "ABORT: рабочее дерево не чистое, закоммить/отложи изменения вручную." | Tee-Object -FilePath $log -Append
  exit 1
}

# Ветка под этот прогон (от текущего main)
git checkout -b $branch 2>&1 | Tee-Object -FilePath $log -Append

# Claude headless: правки авто-приняты (acceptEdits), из bash разрешён только type-check
$prompt = @'
Контекст: SEO-сопровождение amp-minerals.ru (Next.js, мраморный щебень/крошка/мука/микрокальцит).
Источники истины:
- .planning/seo/IMPLEMENTATION-ROADMAP.md (дорожная карта)
- .planning/seo/CONTENT-CALENDAR.md (темы статей)
- lib/data/semantic-core.ts (запросник: query/frequency/intent/cluster/target)

Сделай за один проход:
1. Сверься с roadmap и фактом в репо (что из /faq, /primenenie/*, /[city], blog уже есть). Найди СЛЕДУЮЩУЮ незакрытую задачу высокого приоритета.
2. Реализуй ровно ОДНУ задачу (новая страница ИЛИ статья ИЛИ FAQ-блок). Добавь её ключи в lib/data/semantic-core.ts (target на новый путь), привяжи keywords через keywordsForTarget/mergeKeywords.
3. Прогони `npm run type-check`, добейся чистого прохода. НЕ делай git-коммитов — это сделает скрипт.
Финальным сообщением выведи: ✅ что сделал | 📁 файлы | 🔑 ключи | 📋 следующая задача.
'@
claude -p $prompt --permission-mode acceptEdits --allowedTools "Bash(npm run type-check)" 2>&1 | Tee-Object -FilePath $log -Append

# Коммитим, если агент что-то изменил
if (git status --porcelain) {
  git add -A 2>&1 | Tee-Object -FilePath $log -Append
  git commit -m "seo(auto): 3-day routine $date" 2>&1 | Tee-Object -FilePath $log -Append
  "COMMIT на ветке $branch — проверь diff и смержи: git checkout main; git merge $branch" | Tee-Object -FilePath $log -Append
} else {
  "Агент ничего не изменил — удаляю пустую ветку." | Tee-Object -FilePath $log -Append
  git checkout main 2>&1 | Tee-Object -FilePath $log -Append
  git branch -D $branch 2>&1 | Tee-Object -FilePath $log -Append
}

git checkout main 2>&1 | Tee-Object -FilePath $log -Append
"=== done $(Get-Date) ===" | Tee-Object -FilePath $log -Append
