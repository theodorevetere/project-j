import Nav from '@/components/Nav'

const SPONSORED = [
  { id: 's1', brand: 'Reformation', name: 'Linen Wrap Dress', price: '$218', category: 'Dresses', emoji: '👗', tags: ['summer', 'date night'] },
  { id: 's2', brand: 'Mejuri', name: 'Gold Chain Necklace', price: '$195', category: 'Accessories', emoji: '📿', tags: ['everyday', 'minimal'] },
]

const ORGANIC = [
  { id: 'o1', brand: 'Everlane', name: 'The Linen Shirt', price: '$68', category: 'Tops', emoji: '👕', tags: ['casual', 'summer'] },
  { id: 'o2', brand: 'Madewell', name: 'High Rise Straight Jeans', price: '$128', category: 'Bottoms', emoji: '👖', tags: ['casual', 'everyday'] },
  { id: 'o3', brand: 'ARITZIA', name: 'Effortless Pant', price: '$95', category: 'Bottoms', emoji: '👖', tags: ['work', 'minimal'] },
  { id: 'o4', brand: 'Veja', name: 'Campo Sneaker', price: '$150', category: 'Shoes', emoji: '👟', tags: ['casual', 'everyday'] },
]

export default function RecommendationsPage() {
  const feed = [
    { ...SPONSORED[0], sponsored: true },
    { ...ORGANIC[0], sponsored: false },
    { ...ORGANIC[1], sponsored: false },
    { ...SPONSORED[1], sponsored: true },
    { ...ORGANIC[2], sponsored: false },
    { ...ORGANIC[3], sponsored: false },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Recommended For You</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Based on your closet, style, and saved outfits</p>

        {/* Filter tags */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'].map(tag => (
            <button key={tag} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${tag === 'All' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {feed.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition">
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                <span className="text-6xl">{item.emoji}</span>
                {item.sponsored && (
                  <span className="absolute top-2 right-2 bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    Sponsored
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.brand}</p>
                <p className="font-semibold text-sm mt-0.5">{item.name}</p>
                <p className="text-gray-500 text-sm mt-1">{item.price}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className="mt-3 w-full border border-gray-200 rounded-xl py-2 text-sm hover:bg-gray-50 transition">
                  View Item →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}