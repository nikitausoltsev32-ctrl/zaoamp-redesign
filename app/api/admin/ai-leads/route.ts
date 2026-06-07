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

  // Convert strings to Buffers for timing-safe comparison
  // Using fallback '' to prevent fatal TypeError if adminToken is undefined
  const adminTokenBuffer = Buffer.from(adminToken || '', 'utf-8')
  const requestTokenBuffer = Buffer.from(requestToken, 'utf-8')

  let isMatch = false
  if (adminTokenBuffer.length === requestTokenBuffer.length) {
    // If lengths are equal, we can safely compare
    isMatch = crypto.timingSafeEqual(adminTokenBuffer, requestTokenBuffer)
  } else {
    // If lengths differ, we still perform timingSafeEqual on a dummy buffer to avoid length-based timing leaks
    // We compare a dummy buffer to itself to ensure the execution time is roughly the same
    // We know the result is a mismatch due to length difference
    crypto.timingSafeEqual(adminTokenBuffer, adminTokenBuffer)
  }

  if (!isMatch) {
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
