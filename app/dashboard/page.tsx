import Nav from '@/components/Nav'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Good morning ✨</h1>
        <p className="text-gray-500 mb-10">Here's your wardrobe at a glance.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Closet Items', value: '0' },
            { label: 'Outfits', value: '0' },
            { label: 'Folders', value: '0' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a href="/closet" className="bg-black text-white rounded-2xl p-6 hover:bg-gray-800 transition">
            <p className="text-2xl mb-2">👗</p>
            <p className="font-semibold">Add Item</p>
            <p className="text-gray-400 text-sm mt-1">Add a piece to your closet</p>
          </a>
          <a href="/outfit-builder" className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition">
            <p className="text-2xl mb-2">✨</p>
            <p className="font-semibold">Create Outfit</p>
            <p className="text-gray-500 text-sm mt-1">Build a new look</p>
          </a>
          <a href="/folders" className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition">
            <p className="text-2xl mb-2">📁</p>
            <p className="font-semibold">New Folder</p>
            <p className="text-gray-500 text-sm mt-1">Plan a trip or occasion</p>
          </a>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { href: '/recommendations', label: '🛍️ Discover', desc: 'Find new pieces' },
            { href: '/profile', label: '📏 My Profile', desc: 'Update measurements' },
            { href: '/fit-result', label: '🧠 Fit Engine', desc: 'Try a fit preview' },
            { href: '/folders', label: '🗂️ Folders', desc: 'Plan trips & occasions' },
          ].map(item => (
            <a key={item.href} href={item.href} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-300 transition">
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
            </a>
          ))}
        </div>

        {/* Ad Banner Slot */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
          <p className="font-medium">Advertisement</p>
          <p className="text-xs mt-1">Sponsored placement slot</p>
        </div>
      </div>
    </main>
  )
}