import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/server'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

/** POST /api/leads — сохранить заявку на КП (телефон) в Supabase + уведомление на почту */
export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase не настроен. Добавьте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const source = body?.source ?? 'hero'

    if (!phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('kp_leads').insert({
      phone,
      source,
    })

    if (error) {
      console.error('[leads] Supabase error:', error)
      return NextResponse.json(
        { error: 'Ошибка сохранения заявки' },
        { status: 500 }
      )
    }

    // Отправка уведомления на почту
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    const fromEmail = process.env.RESEND_FROM ?? 'ZAO AMP <onboarding@resend.dev>'

    if (resend && notificationEmail) {
      const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `Новая заявка на КП — ${phone}`,
        html: `
          <h2>Новая заявка на коммерческое предложение</h2>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Источник:</strong> ${source}</p>
          <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        `,
      })
      if (emailError) {
        console.error('[leads] Resend error:', emailError)
        // Не возвращаем ошибку пользователю — заявка уже сохранена
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
