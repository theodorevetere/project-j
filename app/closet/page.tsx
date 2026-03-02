'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Accessories', 'Outerwear']

type Item = {
  id: string
  name: string
  brand: string
  category: string
  color: string
  imageUrl: string
  tags: string[]
}

const SAMPLE_ITEMS: Item[] = [
  { id: '1', name: 'White Linen Shirt', brand: 'Zara', category: 'Tops', color: 'White', imageUrl: '', tags: ['casual', 'summer'] },
  { id: '2', name: 'High Waist Jeans', brand: 'Levi\'s', category: 'Bottoms', color: 'Blue', imageUrl: '', tags: ['casual', 'everyday'] },
  { id: '3', name: 'Black Blazer', brand: 'H&M', category: 'Outerwear', color: 'Black', imageUrl: '', tags: ['work', 'formal'] },
  { id: '4', name: 'Floral Midi Dress', brand: 'ASOS', category: 'Dresses', color: 'Pink', imageUrl: '', tags: ['summer', 'date night'] },
  { id: '5', name: 'White Sneakers', brand: 'Nike', category: 'Shoes', color: 'White', imageUrl: '', tags: ['casual', 'everyday'] },
  { id: '6', name: 'Gold Hoop Earrings', brand: 'Mejuri', category: 'Accessories', color: 'Gold', imageUrl: '', tags: ['everyday'] },
]

export default function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', brand: '', category: 'Tops', color: '', imageUrl: '', tags: '' })
  const [items, setItems] = useState<Item[]>(SAMPLE_ITEMS)

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory)

  const handleAdd = () => {
    if (!newItem.name) return
    setItems([...items, {
      id: Date.now().toString(),
      name: newItem.name,
      brand: newItem.brand,
      category: newItem.category,
      color: newItem.color,
      imageUrl: newItem.imageUrl,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
    }])
    setShowAddModal(false)
    setNewItem({ name: '', brand: '', category: 'Tops', color: '', imageUrl: '', tags: '' })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">Project J</span>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/closet" className="font-medium text-black">Closet</Link>
          <Link href="/folders" className="hover:text-black">Folders</Link>
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Closet</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} items</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition">
            + Add Item
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👗</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-gray-400 text-xs">{item.brand}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{item.color}</span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Item</h2>
            <div className="space-y-3">
              <input placeholder="Item name *" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <input placeholder="Brand" value={newItem.brand} onChange={e => setNewItem({...newItem, brand: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Color" value={newItem.color} onChange={e => setNewItem({...newItem, color: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <input placeholder="Image URL (optional)" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <input placeholder="Tags (comma separated)" value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAdd} className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition">Add Item</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}