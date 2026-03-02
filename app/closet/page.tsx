'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Accessories', 'Outerwear']
const STATUSES = ['All', 'Owned', 'Considering', 'Wishlist']

// Demo user ID until auth is built
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

type Item = {
  id: string
  name: string
  brand: string
  category: string
  color: string
  imageUrl: string
  tags: string[]
  status: 'Owned' | 'Considering' | 'Wishlist'
  fitResult?: {
    suggestedSize: string
    confidence: string
  }
}

export default function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', brand: '', category: 'Tops', color: '', imageUrl: '', tags: '', status: 'Owned' })
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/closet?userId=${DEMO_USER_ID}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setItems(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand || '',
          category: item.category || '',
          color: item.color || '',
          imageUrl: item.image_url || '',
          tags: item.tags || [],
          status: item.status || 'Owned',
          fitResult: item.fit_suggested_size ? {
            suggestedSize: item.fit_suggested_size,
            confidence: item.fit_confidence || 'medium',
          } : undefined,
        })))
      }
    } catch (e) {
      console.error('Failed to fetch items', e)
    }
    setLoading(false)
  }

  const filtered = items.filter(i => {
    const catMatch = activeCategory === 'All' || i.category === activeCategory
    const statusMatch = activeStatus === 'All' || i.status === activeStatus
    return catMatch && statusMatch
  })

  const handleAdd = async () => {
    if (!newItem.name) return
    setSaving(true)
    try {
      const res = await fetch('/api/closet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          name: newItem.name,
          brand: newItem.brand,
          category: newItem.category,
          color: newItem.color,
          imageUrl: newItem.imageUrl,
          tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
          status: newItem.status,
        }),
      })
      const saved = await res.json()
      if (saved.id) {
        setItems(prev => [{
          id: saved.id,
          name: saved.name,
          brand: saved.brand || '',
          category: saved.category || '',
          color: saved.color || '',
          imageUrl: saved.image_url || '',
          tags: saved.tags || [],
          status: saved.status || 'Owned',
        }, ...prev])
      }
    } catch (e) {
      console.error('Failed to save item', e)
    }
    setSaving(false)
    setShowAddModal(false)
    setNewItem({ name: '', brand: '', category: 'Tops', color: '', imageUrl: '', tags: '', status: 'Owned' })
  }

  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    await fetch(`/api/closet?id=${id}`, { method: 'DELETE' })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

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
        <div className="flex gap-2 mb-4 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8">
          {STATUSES.map(status => (
            <button key={status} onClick={() => setActiveStatus(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeStatus === status
                  ? status === 'Considering' ? 'bg-purple-600 text-white'
                  : status === 'Wishlist' ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}>
              {status}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">👗</p>
            <p className="text-sm">Loading your closet...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">👗</p>
            <p className="font-medium">No items yet</p>
            <p className="text-sm mt-1">Click "+ Add Item" to start building your closet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition group">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👗</span>
                  )}
                  {item.status !== 'Owned' && (
                    <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'Considering' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
                    </span>
                  )}
                  {item.fitResult && (
                    <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Size {item.fitResult.suggestedSize}
                    </span>
                  )}
                  <button onClick={() => handleDelete(item.id)}
                    className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                    Remove
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.brand}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{item.color}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{item.category}</span>
                  </div>
                  {item.fitResult && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-gray-400">Fit confidence:</span>
                      <span className={`text-xs font-medium capitalize ${
                        item.fitResult.confidence === 'high' ? 'text-green-600' :
                        item.fitResult.confidence === 'medium' ? 'text-orange-500' : 'text-gray-400'
                      }`}>{item.fitResult.confidence}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
              <select value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                <option value="Owned">Owned</option>
                <option value="Considering">Considering</option>
                <option value="Wishlist">Wishlist</option>
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
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}