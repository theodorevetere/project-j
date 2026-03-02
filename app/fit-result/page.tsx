'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { runFitEngine, BodyProfile, ProductInfo } from '@/lib/fitEngine'

const DEMO_PRODUCT: ProductInfo = {
  name: 'Linen Wrap Dress',
  category: 'dress',
  fabric: '100% linen',
  cutNotes: 'true to size',
  sizeChart: {
    'XS': { bust: { min: 32, max: 33 }, waist: { min: 24, max: 25 }, hips: { min: 34, max: 35 } },
    'S':  { bust: { min: 34, max: 35 }, waist: { min: 26, max: 27 }, hips: { min: 36, max: 37 } },
    'M':  { bust: { min: 36, max: 37 }, waist: { min: 28, max: 29 }, hips: { min: 38, max: 39 } },
    'L':  { bust: { min: 38, max: 39 }, waist: { min: 30, max: 31 }, hips: { min: 40, max: 41 } },
    'XL': { bust: { min: 40, max: 41 }, waist: { min: 32, max: 33 }, hips: { min: 42, max: 43 } },
  },
  modelHeight: 70,
  modelSize: 'S',
}

const fitColor = (result: string) => {
  if (result === 'tight') return 'bg-red-100 text-red-700'
  if (result === 'snug') return 'bg-orange-100 text-orange-700'
  if (result === 'true') return 'bg-green-100 text-green-700'
  if (result === 'relaxed') return 'bg-blue-100 text-blue-700'
  if (result === 'oversized') return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

const confidenceColor = (c: string) => {
  if (c === 'high') return 'text-green-600'
  if (c === 'medium') return 'text-orange-500'
  return 'text-gray-400'
}

export default function FitResultPage() {
  const [result, setResult] = useState<ReturnType<typeof runFitEngine> | null>(null)
  const [profile, setProfile] = useState<BodyProfile | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('bodyProfile')
    if (saved) {
      const p = JSON.parse(saved)
      const body: BodyProfile = {
        height: parseInt(p.height_ft) * 12 + parseInt(p.height_in || '0'),
        weight: parseFloat(p.weight),
        bust: parseFloat(p.bust),
        waist: parseFloat(p.waist),
        hips: parseFloat(p.hips),
        thigh: parseFloat(p.thigh),
        inseam: parseFloat(p.inseam),
      }
      setProfile(body)
      setResult(runFitEngine(body, DEMO_PRODUCT))
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Fit Analysis</p>
          <h1 className="text-3xl font-bold">{DEMO_PRODUCT.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{DEMO_PRODUCT.fabric} · {DEMO_PRODUCT.cutNotes}</p>
        </div>

        {!profile ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-4xl mb-3">📏</p>
            <p className="font-semibold mb-2">No body profile found</p>
            <p className="text-gray-500 text-sm mb-4">Add your measurements to get a fit prediction</p>
            <Link href="/profile" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              Set Up My Profile →
            </Link>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Size Recommendation */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Suggested Size</p>
                  <p className="text-5xl font-bold">{result.suggestedSize}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Confidence</p>
                  <p className={`text-lg font-semibold capitalize ${confidenceColor(result.confidence)}`}>
                    {result.confidence}
                  </p>
                </div>
              </div>
            </div>

            {/* Fit Forecast */}
            {result.fitForecast.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold mb-4">Fit Forecast</h2>
                <div className="space-y-3">
                  {result.fitForecast.map(f => (
                    <div key={f.area} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{f.area}</span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${fitColor(f.result)}`}>
                        {f.result} {f.note ? `· ${f.note}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold mb-4">Why we recommend {result.suggestedSize}</h2>
              <ul className="space-y-2">
                {result.reasoning.map((r, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-300 mt-0.5">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                <h2 className="font-semibold mb-3 text-amber-800">⚠️ Heads up</h2>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-amber-700">{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save to Closet */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold mb-2">Like what you see?</h2>
              <p className="text-gray-500 text-sm mb-4">Save this item to your closet as "Considering"</p>
              <button className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition">
                + Save to Closet
              </button>
            </div>

            <Link href="/profile"
              className="block text-center border border-gray-200 rounded-2xl py-3 text-sm text-gray-500 hover:bg-gray-50 transition">
              Update My Measurements →
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  )
}