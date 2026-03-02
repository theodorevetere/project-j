import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <span className="text-2xl font-bold tracking-tight">Project J</span>
        <Link href="/auth/signin" className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Your wardrobe,<br />organized.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Build outfits from your closet and carts. Plan trips in minutes. Never wonder "what to wear" again.
        </p>
        <Link href="/auth/signin" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition">
          Start Building Your Closet
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: "Closet Library", desc: "Add every item you own. Filter by color, category, brand, and more." },
          { title: "Outfit Builder", desc: "Drag and drop items onto a canvas to create and save complete looks." },
          { title: "Trip Folders", desc: "Pack for Nashville, plan for date night. Organize outfits into folders." },
        ].map((f) => (
          <div key={f.title} className="p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}