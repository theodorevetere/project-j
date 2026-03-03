import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <span className="text-2xl font-bold tracking-tight">Project J</span>
        <Link href="/closet" className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <p className="text-sm font-medium text-purple-600 mb-4 tracking-wide uppercase">Fit Intelligence</p>
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Stop buying clothes<br />that don't fit.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Project J predicts your size before you buy — then saves everything to your wardrobe so you can build outfits with what you own and what you're considering.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/closet" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition">
            Build My Closet
          </Link>
          <Link href="/fit-result" className="border border-gray-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition">
            Try Fit Preview
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            emoji: '📏',
            title: 'Fit Intelligence',
            desc: 'Enter your measurements once. Get accurate size predictions on any item from any brand, before you buy.'
          },
          {
            emoji: '👗',
            title: 'Your Digital Closet',
            desc: 'Everything you own and everything you\'re considering, in one place. Filter by status, category, brand, and more.'
          },
          {
            emoji: '✨',
            title: 'Outfit Builder',
            desc: 'Drag items onto a canvas to build complete looks. Mix what you own with what you\'re thinking about buying.'
          },
        ].map((f) => (
          <div key={f.title} className="p-8 bg-gray-50 rounded-2xl">
            <p className="text-3xl mb-4">{f.emoji}</p>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Social proof placeholder */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-2xl font-bold mb-2">"I haven't returned a single item since I started using Project J."</p>
          <p className="text-gray-500 text-sm">— Early beta user</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to know your fit?</h2>
        <p className="text-gray-500 mb-8">Join the waitlist for the browser extension — coming soon.</p>
        <Link href="/closet" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition">
          Start Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 text-center text-gray-400 text-xs">
        © 2025 Project J. All rights reserved.
      </footer>
    </main>
  )
}