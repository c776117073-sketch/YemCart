'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'
import { useCart } from '@/lib/stores/cartStore'

export default function BottomNav() {
  const pathname = usePathname()
  const { getItemsCount } = useCart()
  const cartCount = getItemsCount()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg z-40">
      <div className="flex justify-around items-center h-20 max-w-6xl mx-auto px-4">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-16 h-16 gap-1 transition ${
            isActive('/') ? 'text-red-500' : 'text-white/60 hover:text-white'
          }`}
        >
          <FiHome size={24} />
          <span className="text-xs">الرئيسية</span>
        </Link>

        {/* Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center w-16 h-16 gap-1 transition ${
            isActive('/search') ? 'text-red-500' : 'text-white/60 hover:text-white'
          }`}
        >
          <FiSearch size={24} />
          <span className="text-xs">بحث</span>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center w-16 h-16 gap-1 relative transition ${
            isActive('/cart') ? 'text-red-500' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className="relative">
            <FiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs">السلة</span>
        </Link>

        {/* Account */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-16 h-16 gap-1 transition ${
            isActive('/profile') ? 'text-red-500' : 'text-white/60 hover:text-white'
          }`}
        >
          <FiUser size={24} />
          <span className="text-xs">حسابي</span>
        </Link>
      </div>
    </nav>
  )
}
