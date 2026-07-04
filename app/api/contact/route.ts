import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { escapeHtml, sendTelegram } from '@/lib/telegram'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

/** POST /api/contact — обращение через форму контактов */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    const utm = body?.utm || {}

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Имя, телефон и сообщение обязательны' },
        { status: 400 }
      )
    }

    const time = new Date().toLocaleString('ru-RU')
    const safeName = escapeHtml(name)
    const safePhone = escapeHtml(phone)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    // Формируем блок UTM
    let utmText = ''
    if (utm.utm_source || utm.utm_campaign) {
      utmText = `\n\n<b>Реклама (UTM):</b>`
      if (utm.utm_source) utmText += `\nИсточник: ${escapeHtml(utm.utm_source)}`
      if (utm.utm_medium) utmText += `\nТип: ${escapeHtml(utm.utm_medium)}`
      if (utm.utm_campaign) utmText += `\nКампания: ${escapeHtml(utm.utm_campaign)}`
      if (utm.utm_term) utmText += `\nКлюч: ${escapeHtml(utm.utm_term)}`
    }

    // Уведомление в Telegram
    const emailLine = safeEmail ? `\nEmail: ${safeEmail}` : ''
    await sendTelegram(
      `<b>Новое обращение с сайта</b>\nИмя: <b>${safeName}</b>\nТелефон: <b>${safePhone}</b>${emailLine}\nСообщение: ${safeMessage}${utmText}\nВремя: ${time}`
    )

    // Уведомление на почту
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    const fromEmail = process.env.RESEND_FROM ?? 'ZAO AMP <onboarding@resend.dev>'

    if (resend && notificationEmail) {
      const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `Новое обращение с сайта — ${name}`,
        html: `
          <h2>Новое обращение через форму контактов</h2>
          <p><strong>Имя:</strong> ${safeName}</p>
          <p><strong>Телефон:</strong> ${safePhone}</p>
          ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ''}
          <p><strong>Сообщение:</strong> ${safeMessage}</p>
          <p><strong>Время:</strong> ${time}</p>
        `,
      })
      if (emailError) {
        console.error('[contact] Resend error:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[contact] Unexpected error:', e)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
