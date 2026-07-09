import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { appendAiLead } from '@/lib/ai/lead-store'
import { escapeHtml, sendTelegram } from '@/lib/telegram'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

/** POST /api/leads — заявка на КП (телефон): уведомление в Telegram + на почту */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const source = body?.source ?? 'hero'
    const productName = typeof body?.productName === 'string' ? body.productName.trim() : ''
    const productSlug = typeof body?.productSlug === 'string' ? body.productSlug.trim() : ''
    const quantityTons = typeof body?.quantityTons === 'number' ? body.quantityTons : undefined
    const packaging = typeof body?.packaging === 'string' ? body.packaging.trim() : ''
    const subtotal = typeof body?.subtotal === 'number' ? body.subtotal : undefined
    
    // Новые поля из CRO обновлений
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const city = typeof body?.city === 'string' ? body.city.trim() : ''
    const utm = body?.utm || {}

    if (!phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      )
    }

    const time = new Date().toLocaleString('ru-RU')
    const safePhone = escapeHtml(phone)
    const safeSource = escapeHtml(String(source))
    const orderLines = [
      productName ? `Товар: ${escapeHtml(productName)}` : '',
      productSlug ? `URL: /product/${escapeHtml(productSlug)}/` : '',
      quantityTons ? `Объём: ${quantityTons} т` : '',
      packaging ? `Упаковка: ${escapeHtml(packaging)}` : '',
      subtotal ? `Товар без доставки: ${new Intl.NumberFormat('ru-RU').format(subtotal)} ₽` : '',
    ].filter(Boolean)
    const orderText = orderLines.length ? `\n${orderLines.join('\n')}` : ''
    const orderHtml = orderLines.length
      ? orderLines.map((line) => `<p>${line}</p>`).join('')
      : ''

    const nameLine = name ? `\nИмя: ${escapeHtml(name)}` : ''
    const cityLine = city ? `\nГород: ${escapeHtml(city)}` : ''
    
    // Формируем блок UTM
    let utmText = ''
    if (utm.utm_source || utm.utm_campaign) {
      utmText = `\n\n<b>Реклама (UTM):</b>`
      if (utm.utm_source) utmText += `\nИсточник: ${escapeHtml(utm.utm_source)}`
      if (utm.utm_medium) utmText += `\nТип: ${escapeHtml(utm.utm_medium)}`
      if (utm.utm_campaign) utmText += `\nКампания: ${escapeHtml(utm.utm_campaign)}`
      if (utm.utm_term) utmText += `\nКлюч: ${escapeHtml(utm.utm_term)}`
    }

    // Лид на диск до внешних отправок — переживёт сбой Telegram/почты
    try {
      await appendAiLead({
        lead: {
          phone,
          name: name || undefined,
          city: city || undefined,
          productInterest: productName || undefined,
          quantityTons,
          packaging: packaging || undefined,
        },
        pagePath: String(source),
        sessionId: 'leads-form',
        capturedAt: new Date().toISOString(),
      })
    } catch (storeError) {
      console.error('[leads] Lead file write failed:', storeError, phone)
    }

    // Уведомление в Telegram
    try {
      await sendTelegram(
        `<b>Новая заявка на КП</b>\nТелефон: <b>${safePhone}</b>${nameLine}${cityLine}\nИсточник: ${safeSource}${orderText}${utmText}\nВремя: ${time}`
      )
    } catch (telegramError) {
      console.error('[leads] Telegram send failed, lead persisted to file:', telegramError)
    }

    // Уведомление на почту
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    const fromEmail = process.env.RESEND_FROM ?? 'ZAO AMP <onboarding@resend.dev>'

    if (resend && notificationEmail) {
      const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `Новая заявка на КП — ${phone}`,
        html: `
          <h2>Новая заявка на коммерческое предложение</h2>
          <p><strong>Телефон:</strong> ${safePhone}</p>
          <p><strong>Источник:</strong> ${safeSource}</p>
          ${orderHtml}
          <p><strong>Время:</strong> ${time}</p>
        `,
      })
      if (emailError) {
        console.error('[leads] Resend error:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[leads] Unexpected error:', e)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
