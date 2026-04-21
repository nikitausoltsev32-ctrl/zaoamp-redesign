import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/server'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

/** POST /api/contact — обращение через форму контактов */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Имя, телефон и сообщение обязательны' },
        { status: 400 }
      )
    }

    const time = new Date().toLocaleString('ru-RU')

    // Сохранение в Supabase (опционально)
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('contact_messages').insert({
        name,
        phone,
        email: email || null,
        message,
      })
      if (error) {
        console.error('[contact] Supabase error:', error)
      }
    }

    // Уведомление в Telegram
    const emailLine = email ? `\n📧 Email: ${email}` : ''
    await sendTelegram(
      `✉️ <b>Новое обращение с сайта</b>\n👤 Имя: <b>${name}</b>\n📞 Телефон: <b>${phone}</b>${emailLine}\n💬 Сообщение: ${message}\n🕐 Время: ${time}`
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
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          <p><strong>Сообщение:</strong> ${message}</p>
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
