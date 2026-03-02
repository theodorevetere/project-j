'use client'
import { useState } from 'react'
import Link from 'next/link'

type Folder = {
  id: string
  name: string
  emoji: string
  outfitCount: number
}

const SAMPLE_FOLDERS: Folder[] = [
  { id: '1', name: 'Nashville Trip', emoji: '🎸', outfitCount: 3 },
  { id: '2', name: 'Work Outfits', emoji: '💼', outfitCount: 5 },
  { id: '3', name: 'Date Night', emoji: '✨', outfitCount: 2 },
]

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>(SAMPLE_FOLDERS)
  const [showModal, setShowModal] = useState(false)
  const [newFolder, setNewFolder] = useState({ name: '', emoji: '📁' })

  const handleCreate = () => {
    if (!newFolder.name) return
    setFolders([...folders, {
      id: Date.now().toString(),
      name: newFolder.name,
      emoji: newFolder.emoji,
      outfitCount: 0,
    }])
    setShowModal(false)
    setNewFolder({ name: '', emoji: '📁' })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">Project J</span>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/closet" className="hover:text-black">Closet</Link>
          <Link href="/folders" className="font-medium text-black">Folders</Link>
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Folders</h1>
            <p className="text-gray-500 text-sm mt-1">Organize outfits by trip or occasion</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition">
            + New Folder
          </button>
        </div>

        {/* Ad Banner */}
        <div className="bg-gray-100 rounded-2xl p-4 text-center text-gray-400 text-xs border-2 border-dashed border-gray-200 mb-8">
          Advertisement · Sponsored placement
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {folders.map(folder => (
            <div key={folder.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 transition cursor-pointer">
              <div className="text-4xl mb-4">{folder.emoji}</div>
              <h3 className="font-semibold text-lg">{folder.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{folder.outfitCount} outfits</p>
              <div className="flex gap-2 mt-4">
                <button className="text-xs text-gray-400 hover:text-black transition">View</button>
                <span className="text-gray-200">·</span>
                <button className="text-xs text-gray-400 hover:text-red-500 transition"
                  onClick={() => setFolders(folders.filter(f => f.id !== folder.id))}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {folders.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-medium">No folders yet</p>
              <p className="text-sm">Create one to start organizing your outfits</p>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">New Folder</h2>
            <div className="space-y-3">
              <input placeholder="Folder name (e.g. Nashville Trip)" value={newFolder.name}
                onChange={e => setNewFolder({...newFolder, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <input placeholder="Emoji (e.g. 🎸)" value={newFolder.emoji}
                onChange={e => setNewFolder({...newFolder, emoji: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleCreate} className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition">Create</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}