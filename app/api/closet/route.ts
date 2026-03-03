import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400, headers: CORS })

  const { data, error } = await supabase
    .from('closet_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json(data, { headers: CORS })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, name, brand, category, color, imageUrl, tags, status, fitSuggestedSize, fitConfidence } = body

  if (!userId || !name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: CORS })

  const { data, error } = await supabase
    .from('closet_items')
    .insert({
      user_id: userId,
      name,
      brand,
      category,
      color,
      image_url: imageUrl,
      tags,
      status: status || 'Owned',
      fit_suggested_size: fitSuggestedSize,
      fit_confidence: fitConfidence,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json(data, { headers: CORS })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: CORS })

  const { error } = await supabase.from('closet_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json({ success: true }, { headers: CORS })
}