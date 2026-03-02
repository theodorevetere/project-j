'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/closet', label: 'Closet' },
  { href: '/outfit-builder', label: 'Builder' },
  { href: '/folders', label: 'Folders' },
  { href: '/recommendations', label: 'Discover' },
  { href: '/profile', label: 'My Profile' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <Link href="/dashboard" className="text-xl font-bold tracking-tight">
        Project J
      </Link>
      <div className="flex gap-6 text-sm">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition ${
              pathname === link.href
                ? 'text-black font-semibold'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}