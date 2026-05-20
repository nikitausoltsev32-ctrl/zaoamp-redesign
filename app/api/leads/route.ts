import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/server'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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

/** POST /api/leads — сохранить заявку на КП (телефон) в Supabase + уведомление на почту/Telegram */
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

    if (!phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      )
    }

    // Сохранение в Supabase (опционально — не блокирует отправку уведомлений)
    if (supabaseAdmin) {
      const sourceLabel = String(source)
      const { error: kpError } = await supabaseAdmin.from('kp_leads').insert({ phone, source: sourceLabel })
      if (kpError) {
        console.error('[leads] Supabase kp_leads error:', kpError)
      }

      const summaryLines = [
        productName ? `Товар: ${productName}` : '',
        productSlug ? `URL: /product/${productSlug}/` : '',
        quantityTons ? `Объем: ${quantityTons} т` : '',
        packaging ? `Упаковка: ${packaging}` : '',
        subtotal ? `Товар без доставки: ${new Intl.NumberFormat('ru-RU').format(subtotal)} ₽` : '',
      ].filter(Boolean)

      const { error: adminError } = await supabaseAdmin.from('ai_assistant_leads').insert({
        session_id: `kp_${crypto.randomUUID()}`,
        lead_type: 'kp_request',
        phone,
        product_interest: productName || null,
        product_slug: productSlug || null,
        quantity_tons: quantityTons ?? null,
        packaging: packaging || null,
        order_subtotal: subtotal ?? null,
        need: 'Заявка на коммерческое предложение',
        summary: summaryLines.length ? summaryLines.join('\n') : 'Заявка на КП: клиент оставил телефон',
        messages: [],
        source_path: productSlug ? `/product/${productSlug}/` : null,
        source_label: sourceLabel,
        provider: 'site_form',
        status: 'new',
        raw_payload: {
          phone,
          source: sourceLabel,
          productName,
          productSlug,
          quantityTons,
          packaging,
          subtotal,
        },
      })
      if (adminError) {
        console.error('[leads] Supabase admin lead error:', adminError)
      }
    } else {
      console.warn('[leads] Supabase не настроен, заявка не сохранена в БД')
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

    // Уведомление в Telegram
    await sendTelegram(
      `<b>Новая заявка на КП</b>\nТелефон: <b>${safePhone}</b>\nИсточник: ${safeSource}${orderText}\nВремя: ${time}`
    )

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
