'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useRequireAuth } from '@/lib/hooks/useAuth'
import { PageLoadingSpinner } from '@/components/Loaders'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi'
import { logoutUser, getUserData } from '@/lib/auth'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const { isReady, loading } = useRequireAuth()
  const { user, profile } = useAuth()
  const router = useRouter()

  if (loading || !isReady) return <PageLoadingSpinner />

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
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">حسابي</h1>
          <p className="text-white/60">{profile?.email}</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1a0a0a] overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-red-500/20 to-red-600/20 relative">
            {profile?.coverImage && (
              <Image
                src={profile.coverImage}
                alt="غلاف"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 relative">
            {/* Avatar */}
            <div className="absolute -top-16 right-8">
              <div className="w-32 h-32 rounded-full border-4 border-[#1a0a0a] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="صورة الملف"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold">{profile?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>

            <div className="pt-16 space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{profile?.username}</h2>
                  <p className="text-white/60 text-sm mt-1">
                    {profile?.role === 'seller' ? 'بائع' : 'مشتري'}
                  </p>
                </div>

                {profile?.bio && <p className="text-white/70">{profile.bio}</p>}

                <div className="space-y-2 text-sm text-white/60">
                  {profile?.phone && <p>📱 {profile.phone}</p>}
                  <p>📧 {profile?.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
                >
                  <FiEdit size={20} />
                  تعديل الملف
                </Link>

                {profile?.role === 'seller' && (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl font-semibold transition"
                  >
                    <FiShoppingBag size={20} />
                    متجري
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl font-semibold transition"
                >
                  <FiLogOut size={20} />
                  خروج
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/favorites"
            className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-[#1a0a0a] hover:bg-[#2a1a1a] transition"
          >
            <div className="p-3 rounded-lg bg-red-500/20">
              <FiHeart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="font-semibold">المفضلة</p>
              <p className="text-sm text-white/60">عرض منتجاتك المفضلة</p>
            </div>
          </Link>

          {profile?.role === 'seller' && (
            <Link
              href="/dashboard"
              className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-[#1a0a0a] hover:bg-[#2a1a1a] transition"
            >
              <div className="p-3 rounded-lg bg-blue-500/20">
                <FiShoppingBag className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="font-semibold">لوحة التحكم</p>
                <p className="text-sm text-white/60">إدارة متجرك ومنتجاتك</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
