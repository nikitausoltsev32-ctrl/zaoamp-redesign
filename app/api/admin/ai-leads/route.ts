import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'node:crypto'

export async function GET(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN
  const requestToken = request.headers.get('x-admin-token') ?? ''

  if (!adminToken) {
    return NextResponse.json(
      { error: 'ADMIN_TOKEN не настроен на сервере' },
      { status: 503 }
    )
  }

  // Prevent timing attacks by using timingSafeEqual
  const requestTokenBuffer = Buffer.from(requestToken || '')
  const adminTokenBuffer = Buffer.from(adminToken || '')

  const isLengthEqual = requestTokenBuffer.length === adminTokenBuffer.length

  // Always perform the timing safe check even if lengths differ, to avoid length timing leaks.
  // We compare the admin buffer to itself if length is wrong, and use the boolean result
  const isTimingSafeEqual = crypto.timingSafeEqual(
    isLengthEqual ? requestTokenBuffer : adminTokenBuffer,
    adminTokenBuffer
  )

  const isValid = isLengthEqual && isTimingSafeEqual

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
