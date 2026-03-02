'use client'
import { useState, useRef } from 'react'
import Nav from '@/components/Nav'

type ClosetItem = {
  id: string
  name: string
  category: string
  color: string
  emoji: string
}

type PlacedItem = {
  id: string
  itemId: string
  name: string
  emoji: string
  x: number
  y: number
  scale: number
}

const CLOSET_ITEMS: ClosetItem[] = [
  { id: '1', name: 'White Linen Shirt', category: 'Tops', color: 'White', emoji: '👕' },
  { id: '2', name: 'High Waist Jeans', category: 'Bottoms', color: 'Blue', emoji: '👖' },
  { id: '3', name: 'Black Blazer', category: 'Outerwear', color: 'Black', emoji: '🧥' },
  { id: '4', name: 'Floral Midi Dress', category: 'Dresses', color: 'Pink', emoji: '👗' },
  { id: '5', name: 'White Sneakers', category: 'Shoes', color: 'White', emoji: '👟' },
  { id: '6', name: 'Gold Hoops', category: 'Accessories', color: 'Gold', emoji: '💛' },
]

export default function OutfitBuilderPage() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [outfitName, setOutfitName] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addToCanvas = (item: ClosetItem) => {
    const newItem: PlacedItem = {
      id: Date.now().toString(),
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      x: 80 + Math.random() * 200,
      y: 80 + Math.random() * 200,
      scale: 1,
    }
    setPlacedItems([...placedItems, newItem])
  }

  const handleCanvasDrag = (e: React.MouseEvent, id: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    setPlacedItems(prev => prev.map(item =>
      item.id === id ? { ...item, x: e.clientX - rect.left - 40, y: e.clientY - rect.top - 40 } : item
    ))
  }

  const removeItem = (id: string) => {
    setPlacedItems(placedItems.filter(i => i.id !== id))
  }

  const handleSave = () => {
    if (!outfitName) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Outfit Builder</h1>

        <div className="flex gap-6">
          {/* Left: Closet Items */}
          <div className="w-56 shrink-0">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Closet</h2>
            <div className="space-y-2">
              {CLOSET_ITEMS.map(item => (
                <button key={item.id} onClick={() => addToCanvas(item)}
                  className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-left hover:border-gray-300 transition flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-medium leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="flex-1">
            <div ref={canvasRef}
              className="bg-white border-2 border-dashed border-gray-200 rounded-2xl relative overflow-hidden"
              style={{ height: '500px' }}
              onMouseMove={(e) => {
                if (draggingId) handleCanvasDrag(e, draggingId)
              }}
              onMouseUp={() => setDraggingId(null)}
            >
              {placedItems.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <div className="text-center">
                    <p className="text-5xl mb-3">👗</p>
                    <p className="text-sm">Click items from your closet to add them</p>
                  </div>
                </div>
              )}
              {placedItems.map(item => (
                <div key={item.id}
                  className="absolute cursor-move select-none group"
                  style={{ left: item.x, top: item.y, fontSize: `${item.scale * 60}px` }}
                  onMouseDown={(e) => { e.preventDefault(); setDraggingId(item.id) }}
                >
                  <div className="relative">
                    {item.emoji}
                    <button onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center">
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1 bg-white/80 rounded px-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Save Panel */}
          <div className="w-64 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Save Outfit</h2>
              <input placeholder="Outfit name *" value={outfitName}
                onChange={e => setOutfitName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black" />
              <textarea placeholder="Notes (e.g. wear with gold hoops)" value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-black resize-none" />
              <button onClick={handleSave}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${saved ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}>
                {saved ? '✓ Saved!' : 'Save Outfit'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Save to Folder</h2>
              {['Nashville Trip', 'Work Outfits', 'Date Night'].map(f => (
                <label key={f} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-400 font-medium">Sponsored</p>
              <p className="text-xs text-gray-300 mt-1">Ad slot</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}