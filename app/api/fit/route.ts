import { NextRequest, NextResponse } from 'next/server'
import { runFitEngine } from '@/lib/fitEngine'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, product } = body

    if (!userId || !product) {
      return NextResponse.json({ error: 'Missing userId or product' }, { status: 400 })
    }

    // Fetch user's body profile from Supabase
    const { data: profile, error } = await supabase
      .from('body_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'No body profile found for this user' }, { status: 404 })
    }

    const bodyProfile = {
      height: profile.height_inches,
      weight: profile.weight_lbs,
      bust: profile.bust,
      waist: profile.waist,
      hips: profile.hips,
      thigh: profile.thigh,
      inseam: profile.inseam,
    }

    // Run fit engine
    const result = runFitEngine(bodyProfile, {
      name: product.name,
      category: product.category || 'dress',
      fabric: product.fabric || product.description || '',
      cutNotes: product.cutNotes || '',
      sizeChart: product.sizeChart || {},
      modelHeight: product.modelHeight,
      modelSize: product.modelSize,
    })

    return NextResponse.json({
      ...result,
      product: product.name,
      brand: product.brand,
    })

  } catch (err) {
    console.error('Fit API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}