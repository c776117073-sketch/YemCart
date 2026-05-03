'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useRequireAuth } from '@/lib/hooks/useAuth'
import { PageLoadingSpinner } from '@/components/Loaders'
import { useAuth } from '@/lib/contexts/AuthContext'
import { updateUserData, uploadProfileImage, uploadCoverImage } from '@/lib/db'
import { FiArrowRight, FiCamera } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProfileEditPage() {
  const { isReady, loading } = useRequireAuth()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    bio: '',
    avatar: '',
    coverImage: '',
  })
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        coverImage: profile.coverImage || '',
      })
      if (profile.avatar) setAvatarPreview(profile.avatar)
      if (profile.coverImage) setCoverPreview(profile.coverImage)
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const updateData: any = {
        username: formData.username,
        phone: formData.phone,
        bio: formData.bio,
      }

      if (avatarFile) {
        const avatarUrl = await uploadProfileImage(avatarFile, user.uid)
        updateData.avatar = avatarUrl
      }

      if (coverFile) {
        const coverUrl = await uploadCoverImage(coverFile, user.uid)
        updateData.coverImage = coverUrl
      }

      await updateUserData(user.uid, updateData)
      toast.success('تم تحديث الملف الشخصي بنجاح')
      router.push('/profile')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !isReady) return <PageLoadingSpinner />

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-white/10 rounded-lg transition">
            <FiArrowRight size={24} />
          </Link>
          <h1 className="text-3xl font-bold">تعديل الملف الشخصي</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Cover Image */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">صورة الغلاف</label>
            <div className="relative aspect-[4/1] rounded-2xl border-2 border-dashed border-white/20 overflow-hidden bg-[#1a0a0a] cursor-pointer hover:border-white/40 transition group">
              {coverPreview && (
                <Image
                  src={coverPreview}
                  alt="غلاف"
                  fill
                  className="object-cover group-hover:opacity-70 transition"
                />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <div className="text-center">
                  <FiCamera className="mx-auto mb-2" size={32} />
                  <p className="text-sm">اختر صورة</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">صورة الملف الشخصي</label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-[#2a1a1a] bg-gradient-to-br from-red-500 to-red-600 flex-shrink-0 overflow-hidden cursor-pointer group">
                {avatarPreview && (
                  <Image
                    src={avatarPreview}
                    alt="صورة الملف"
                    fill
                    className="w-full h-full object-cover group-hover:opacity-70 transition"
                  />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <FiCamera size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-white/60 text-sm">انقر لتغيير صورة الملف الشخصي</p>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">اسم المستخدم</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">رقم الهاتف (اختياري)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">النبذة الشخصية (اختياري)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 transition resize-none"
              placeholder="أخبرنا عن نفسك..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-xl transition"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <Link
              href="/profile"
              className="flex-1 py-3 px-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition text-center"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </section>

      <BottomNav />
    </main>
  )
}
