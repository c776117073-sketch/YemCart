'use client'

import Link from 'next/link'
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { logoutUser } from '@/lib/auth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('تم تسجيل الخروج بنجاح')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-500">
          YemCart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-white/70 hover:text-white transition text-sm">
            الرئيسية
          </Link>
          <Link href="/search" className="text-white/70 hover:text-white transition text-sm">
            المتاجر
          </Link>
          {user && profile?.role === 'seller' && (
            <Link href="/dashboard" className="text-white/70 hover:text-white transition text-sm">
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-white/70 hover:text-white transition text-sm">
                {profile?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              >
                دخول
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a] p-4 space-y-4">
          <Link href="/" className="block text-white/70 hover:text-white transition text-sm py-2">
            الرئيسية
          </Link>
          <Link href="/search" className="block text-white/70 hover:text-white transition text-sm py-2">
            المتاجر
          </Link>
          {user && profile?.role === 'seller' && (
            <Link href="/dashboard" className="block text-white/70 hover:text-white transition text-sm py-2">
              لوحة التحكم
            </Link>
          )}
          {user ? (
            <>
              <Link href="/profile" className="block text-white/70 hover:text-white transition text-sm py-2">
                الملف الشخصي
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block w-full px-4 py-2 text-center text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
            >
              دخول
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
