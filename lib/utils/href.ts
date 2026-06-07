// Нормализует внутренний путь к канонической форме с завершающим слэшем
// (сайт работает с trailingSlash: true). Внешние ссылки, файлы и якоря не трогает.
export function internalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const q = href.indexOf('?')
  const h = href.indexOf('#')
  const splitIndex = q === -1 ? h : h === -1 ? q : Math.min(q, h)

  const path = splitIndex === -1 ? href : href.slice(0, splitIndex)
  const rest = splitIndex === -1 ? '' : href.slice(splitIndex)

  if (path === '/' || path.endsWith('/')) return href
  if (/\.(?:pdf|docx?|xlsx?|png|jpe?g|svg|ico|webp|gif|txt|xml|json|csv|zip)$/i.test(path)) return href

  return `${path}/${rest}`
}
