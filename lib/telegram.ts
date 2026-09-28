export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** «Пришёл: Яндекс (поиск) → /catalog/kroshka/» по первому заходу посетителя; уже экранировано. */
export function formatFirstTouch(utm: { first_referrer?: unknown; first_landing?: unknown }) {
  const referrer = typeof utm?.first_referrer === 'string' ? utm.first_referrer : ''
  const landing = typeof utm?.first_landing === 'string' ? utm.first_landing : ''
  if (!referrer && !landing) return ''

  let from = 'прямой заход / закладка'
  if (referrer) {
    let host = referrer
    try {
      host = new URL(referrer).hostname
    } catch {
      // оставляем как есть
    }
    if (/(^|\.)yandex\.|(^|\.)ya\.ru$/.test(host)) from = 'Яндекс (поиск)'
    else if (/(^|\.)google\./.test(host)) from = 'Google (поиск)'
    else from = host
  }
  return `Пришёл: ${escapeHtml(from)}${landing ? ` → ${escapeHtml(landing.slice(0, 200))}` : ''}`
}

/** Отправка уведомления в Telegram. Ошибки логируются, не пробрасываются. */
export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы')
    return
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
    if (!res.ok) {
      console.error('[telegram] sendMessage failed:', res.status, await res.text())
    }
  } catch (e) {
    console.error('[telegram] sendMessage error:', e)
  }
}
