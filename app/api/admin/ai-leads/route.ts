import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function GET(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN
  const requestToken = request.headers.get('x-admin-token') ?? ''

  if (!adminToken) {
    return NextResponse.json(
      { error: 'ADMIN_TOKEN не настроен на сервере' },
      { status: 503 }
    )
  }

  // Mitigate timing attacks by comparing using crypto.timingSafeEqual.
  // We avoid short-circuiting on length to prevent length-based timing leaks.
  const aBuffer = Buffer.from(adminToken || '', 'utf-8')
  const bBuffer = Buffer.from(requestToken || '', 'utf-8')

  const isLengthEqual = aBuffer.length === bBuffer.length
  // If lengths differ, compare aBuffer to itself to keep the time consistent
  const isValid = crypto.timingSafeEqual(
    aBuffer,
    isLengthEqual ? bBuffer : aBuffer
  ) && isLengthEqual

  if (!isValid) {
    return NextResponse.json(
      { error: 'Нет доступа' },
      { status: 401 }
    )
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase service_role не настроен' },
      { status: 503 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('ai_assistant_leads')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[admin/ai-leads] Supabase error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить заявки' },
      { status: 500 }
    )
  }

  return NextResponse.json({ leads: data ?? [] })
}
