// Нормализует внутренний путь к канонической форме с завершающим слэшем
// (сайт работает с trailingSlash: true). Внешние ссылки, файлы и якоря не трогает.
export function internalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const splitIndex = (() => {
    const q = href.indexOf('?')
    const h = href.indexOf('#')
    if (q === -1) return h
    if (h === -1) return q
    return Math.min(q, h)
  })()

  const path = splitIndex === -1 ? href : href.slice(0, splitIndex)
  const rest = splitIndex === -1 ? '' : href.slice(splitIndex)

  if (path === '/' || path.endsWith('/')) return href
  if (/\.[a-z0-9]+$/i.test(path)) return href

  return `${path}/${rest}`
}
