'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('email', { email, callbackUrl: '/dashboard', redirect: false })
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-500 mb-8 text-sm">We'll send you a magic link to your email.</p>
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-800 font-medium">Check your email!</p>
            <p className="text-green-600 text-sm mt-1">A magic link has been sent to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </main>
  )
}