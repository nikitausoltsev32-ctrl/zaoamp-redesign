// Семантическое ядро (запросник) ЗАО АМП.
// Частотности — ориентировочные оценки порядка показов/мес по Яндекс.Wordstat
// (РФ), собраны через research, НЕ выгрузка из Wordstat. Перед стратегическими
// решениями перепроверять вручную в wordstat.yandex.ru и обновлять `frequency`.

export type SearchIntent =
  | 'commercial' // намерение купить/узнать цену
  | 'informational' // вопросы, обучающий контент
  | 'geo' // запрос с привязкой к городу/региону

export type KeywordCluster =
  | 'shcheben'
  | 'kroshka'
  | 'muka' // мраморная мука + микрокальцит
  | 'geo'
  | 'b2b' // отраслевые промышленные применения
  | 'info'

export interface KeywordEntry {
  query: string
  frequency: number // приблизит. показов/мес (оценка)
  intent: SearchIntent
  cluster: KeywordCluster
  target: string // путь целевой страницы
}

export const semanticCore: KeywordEntry[] = [
  // --- Щебень: коммерческие ---
  { query: 'мраморный щебень', frequency: 3000, intent: 'commercial', cluster: 'shcheben', target: '/catalog/shcheben' },
  { query: 'мраморный щебень купить', frequency: 1200, intent: 'commercial', cluster: 'shcheben', target: '/catalog/shcheben' },
  { query: 'мраморный щебень цена за тонну', frequency: 500, intent: 'commercial', cluster: 'shcheben', target: '/catalog/shcheben' },
  { query: 'мраморный щебень оптом', frequency: 500, intent: 'commercial', cluster: 'shcheben', target: '/catalog/shcheben' },
  { query: 'мраморный щебень декоративный', frequency: 600, intent: 'commercial', cluster: 'shcheben', target: '/primenenie/landshaft' },
  { query: 'декоративный щебень мраморный', frequency: 400, intent: 'commercial', cluster: 'shcheben', target: '/primenenie/landshaft' },
  { query: 'мраморный щебень для могил', frequency: 320, intent: 'commercial', cluster: 'shcheben', target: '/catalog/shcheben' },
  // --- Щебень: фракционные ---
  { query: 'мраморный щебень фракция 5 20', frequency: 350, intent: 'commercial', cluster: 'shcheben', target: '/product/mramornyj-shheben-10-20' },
  { query: 'мраморный щебень фракция 20 40', frequency: 250, intent: 'commercial', cluster: 'shcheben', target: '/product/mramornyj-shheben-20-50' },
  { query: 'мраморный щебень фракции и размеры', frequency: 130, intent: 'informational', cluster: 'shcheben', target: '/catalog/shcheben' },

  // --- Крошка: коммерческие ---
  { query: 'мраморная крошка', frequency: 2500, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  { query: 'мраморная крошка купить', frequency: 1000, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  { query: 'мраморная крошка цена за тонну', frequency: 450, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  { query: 'мраморная крошка оптом', frequency: 450, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  { query: 'мраморная крошка декоративная', frequency: 550, intent: 'commercial', cluster: 'kroshka', target: '/primenenie/landshaft' },
  { query: 'мраморная крошка для дорожек', frequency: 220, intent: 'informational', cluster: 'kroshka', target: '/primenenie/landshaft' },
  { query: 'мраморная крошка для могил', frequency: 350, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  // --- Крошка: фракционные ---
  { query: 'мраморная крошка фракция 2 5', frequency: 200, intent: 'commercial', cluster: 'kroshka', target: '/catalog/kroshka' },
  { query: 'мраморная крошка фракция 5 10', frequency: 180, intent: 'commercial', cluster: 'kroshka', target: '/product/mramornaya-kroshka-5-10' },

  // --- Мука / микрокальцит: коммерческие ---
  { query: 'мраморная мука', frequency: 1000, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'мраморная мука купить', frequency: 400, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'мраморная мука цена', frequency: 250, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'мраморная мука оптом', frequency: 200, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'микрокальцит', frequency: 800, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'микрокальцит купить', frequency: 300, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'микрокальцит цена', frequency: 200, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'микрокальцит оптом', frequency: 180, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },
  { query: 'микрокальцит мк 200', frequency: 90, intent: 'commercial', cluster: 'muka', target: '/product/mikrokaltsit-5-200-mkm' },
  { query: 'микрокальцит мк 300', frequency: 80, intent: 'commercial', cluster: 'muka', target: '/catalog/muka' },

  // --- Гео (Урал / города) ---
  { query: 'мраморный щебень екатеринбург', frequency: 300, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'мраморная крошка екатеринбург', frequency: 280, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'мраморный щебень цена екатеринбург', frequency: 180, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'мраморная крошка цена екатеринбург', frequency: 160, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'мраморная мука екатеринбург', frequency: 150, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'микрокальцит екатеринбург', frequency: 120, intent: 'geo', cluster: 'geo', target: '/ekaterinburg' },
  { query: 'мраморный щебень урал', frequency: 130, intent: 'geo', cluster: 'geo', target: '/catalog/shcheben' },
  { query: 'мраморная крошка урал', frequency: 110, intent: 'geo', cluster: 'geo', target: '/catalog/kroshka' },
  { query: 'мраморный щебень челябинск', frequency: 120, intent: 'geo', cluster: 'geo', target: '/chelyabinsk' },
  { query: 'мраморная крошка тюмень', frequency: 90, intent: 'geo', cluster: 'geo', target: '/tyumen' },
  { query: 'мраморная крошка пермь', frequency: 90, intent: 'geo', cluster: 'geo', target: '/perm' },
  { query: 'мраморная крошка москва', frequency: 400, intent: 'geo', cluster: 'geo', target: '/moskva' },

  // --- B2B / отраслевые ---
  { query: 'мраморный щебень для бетона', frequency: 250, intent: 'commercial', cluster: 'b2b', target: '/primenenie/dorogi' },
  { query: 'мраморный щебень для асфальта', frequency: 60, intent: 'commercial', cluster: 'b2b', target: '/primenenie/dorogi' },
  { query: 'мраморная крошка для терраццо', frequency: 120, intent: 'commercial', cluster: 'b2b', target: '/catalog/kroshka' },
  { query: 'мраморная крошка для наливных полов', frequency: 90, intent: 'commercial', cluster: 'b2b', target: '/catalog/kroshka' },
  { query: 'мраморная мука для сухих строительных смесей', frequency: 130, intent: 'commercial', cluster: 'b2b', target: '/primenenie/shtukaturka' },
  { query: 'мраморная мука для шпаклевок', frequency: 90, intent: 'commercial', cluster: 'b2b', target: '/primenenie/shtukaturka' },
  { query: 'микрокальцит для красок', frequency: 110, intent: 'commercial', cluster: 'b2b', target: '/primenenie/lkm' },
  { query: 'микрокальцит для пвх компаундов', frequency: 70, intent: 'commercial', cluster: 'b2b', target: '/primenenie/lkm' },
  { query: 'микрокальцит для пластмасс', frequency: 60, intent: 'commercial', cluster: 'b2b', target: '/primenenie/lkm' },
  { query: 'мраморный наполнитель для красок', frequency: 80, intent: 'commercial', cluster: 'b2b', target: '/primenenie/lkm' },
  { query: 'мраморная мука для стекла', frequency: 40, intent: 'commercial', cluster: 'b2b', target: '/catalog/muka' },
  { query: 'мраморный щебень биг бэг', frequency: 90, intent: 'commercial', cluster: 'b2b', target: '/catalog/shcheben' },
  { query: 'микрокальцит в биг бэгах', frequency: 50, intent: 'commercial', cluster: 'b2b', target: '/catalog/muka' },
  { query: 'мраморная мука гост', frequency: 120, intent: 'informational', cluster: 'b2b', target: '/catalog/muka' },
  { query: 'микрокальцит гост', frequency: 90, intent: 'informational', cluster: 'b2b', target: '/catalog/muka' },
  { query: 'мраморная мука паспорт качества', frequency: 70, intent: 'informational', cluster: 'b2b', target: '/documents' },

  // --- Информационные (FAQ / блог) ---
  { query: 'что такое мраморная мука', frequency: 250, intent: 'informational', cluster: 'info', target: '/catalog/muka' },
  { query: 'что такое микрокальцит', frequency: 220, intent: 'informational', cluster: 'info', target: '/catalog/muka' },
  { query: 'чем микрокальцит отличается от мраморной муки', frequency: 120, intent: 'informational', cluster: 'info', target: '/blog' },
  { query: 'как выбрать мраморный щебень для бетона', frequency: 80, intent: 'informational', cluster: 'info', target: '/blog' },
  { query: 'чем мраморный щебень лучше гранитного по радиации', frequency: 90, intent: 'informational', cluster: 'info', target: '/blog/mramornyj-shcheben-vs-granitnyj' },
  { query: 'какой радиационный класс у мраморного щебня', frequency: 80, intent: 'informational', cluster: 'info', target: '/blog/radiacionnaya-bezopasnost-shchebnya-klass-1' },
  { query: 'какой гост на мраморный щебень', frequency: 130, intent: 'informational', cluster: 'info', target: '/blog' },
  { query: 'какой гост на мраморную муку', frequency: 120, intent: 'informational', cluster: 'info', target: '/catalog/muka' },
  { query: 'какая плотность мраморной муки', frequency: 80, intent: 'informational', cluster: 'info', target: '/catalog/muka' },
  { query: 'применение мраморной крошки', frequency: 150, intent: 'informational', cluster: 'info', target: '/primenenie' },
  { query: 'применение мраморной муки', frequency: 120, intent: 'informational', cluster: 'info', target: '/primenenie' },
  { query: 'применение микрокальцита', frequency: 100, intent: 'informational', cluster: 'info', target: '/primenenie' },
  { query: 'белизна микрокальцита 98 процентов', frequency: 60, intent: 'informational', cluster: 'info', target: '/blog/belizna-mikrokalsita-98-procentov' },
  { query: 'как выбрать фракцию мраморной крошки', frequency: 90, intent: 'informational', cluster: 'info', target: '/blog/kak-vybrat-frakciyu-mramornoj-kroshki' },
]

// Ключи для страницы, отсортированные по убыванию частотности.
export function keywordsForTarget(target: string, limit = 8): string[] {
  const normalized = target.replace(/\/$/, '') || '/'
  return semanticCore
    .filter((k) => k.target === normalized)
    .sort((a, b) => b.frequency - a.frequency)
    .map((k) => k.query)
    .slice(0, limit)
}
