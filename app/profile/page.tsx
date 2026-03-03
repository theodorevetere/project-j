'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

type BodyProfile = {
  height_ft: string
  height_in: string
  weight: string
  bust: string
  waist: string
  hips: string
  thigh: string
  inseam: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<BodyProfile>({
    height_ft: '', height_in: '', weight: '',
    bust: '', waist: '', hips: '', thigh: '', inseam: ''
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/profile?userId=${DEMO_USER_ID}`)
      const data = await res.json()
      if (data && data.height_inches) {
        const ft = Math.floor(data.height_inches / 12)
        const inches = data.height_inches % 12
        setProfile({
          height_ft: ft.toString(),
          height_in: inches.toString(),
          weight: data.weight_lbs?.toString() || '',
          bust: data.bust?.toString() || '',
          waist: data.waist?.toString() || '',
          hips: data.hips?.toString() || '',
          thigh: data.thigh?.toString() || '',
          inseam: data.inseam?.toString() || '',
        })
      }
    } catch (e) {
      console.error('Failed to fetch profile', e)
    }
    setLoading(false)
  }

  const update = (field: keyof BodyProfile, value: string) =>
    setProfile(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const heightInches = parseInt(profile.height_ft || '0') * 12 + parseInt(profile.height_in || '0')
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          heightInches,
          weightLbs: parseFloat(profile.weight),
          bust: parseFloat(profile.bust),
          waist: parseFloat(profile.waist),
          hips: parseFloat(profile.hips),
          thigh: parseFloat(profile.thigh),
          inseam: parseFloat(profile.inseam),
        }),
      })
      const data = await res.json()
      if (data.id || data.user_id) {
        // Also save to localStorage for fit-result page to use
        localStorage.setItem('bodyProfile', JSON.stringify(profile))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      console.error('Failed to save profile', e)
    }
    setSaving(false)
  }

  const InputField = ({ label, field, placeholder, unit }: {
    label: string, field: keyof BodyProfile, placeholder: string, unit: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={placeholder}
          value={profile[field]}
          onChange={e => update(field, e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <span className="text-gray-400 text-sm w-8">{unit}</span>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Body Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Your measurements power the Fit Intelligence Engine</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-semibold text-lg mb-6">
            Measurements
            {loading && <span className="text-sm font-normal text-gray-400 ml-2">Loading...</span>}
          </h2>

          {/* Height */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 flex-1">
                <input type="number" placeholder="5" value={profile.height_ft}
                  onChange={e => update('height_ft', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                <span className="text-gray-400 text-sm">ft</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <input type="number" placeholder="7" value={profile.height_in}
                  onChange={e => update('height_in', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                <span className="text-gray-400 text-sm">in</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <InputField label="Weight" field="weight" placeholder="135" unit="lbs" />
            <InputField label="Bust" field="bust" placeholder="36" unit="in" />
            <InputField label="Waist" field="waist" placeholder="28" unit="in" />
            <InputField label="Hips" field="hips" placeholder="38" unit="in" />
            <InputField label="Thigh" field="thigh" placeholder="22" unit="in" />
            <InputField label="Inseam" field="inseam" placeholder="30" unit="in" />
          </div>

          {/* How to measure guide */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">📏 How to measure</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li><span className="font-medium">Bust:</span> Fullest part of chest, arms relaxed</li>
              <li><span className="font-medium">Waist:</span> Narrowest part, usually 1" above belly button</li>
              <li><span className="font-medium">Hips:</span> Fullest part, usually 7-9" below waist</li>
              <li><span className="font-medium">Thigh:</span> Fullest part of upper thigh</li>
              <li><span className="font-medium">Inseam:</span> Crotch to ankle bone</li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-xl text-sm font-medium transition ${
              saved ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800 disabled:opacity-50'
            }`}>
            {saved ? '✓ Profile Saved!' : saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Fit Engine Preview */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-semibold text-lg mb-2">Fit Intelligence</h2>
          <p className="text-gray-500 text-sm mb-4">Once you save your profile, Project J will predict your size on any item.</p>
          <Link href="/fit-result"
            className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition">
            Try a Fit Preview →
          </Link>
        </div>
      </div>
    </main>
  )
}