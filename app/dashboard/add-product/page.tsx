'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useRequireRole } from '@/lib/hooks/useAuth'
import { PageLoadingSpinner } from '@/components/Loaders'
import { useAuth } from '@/lib/contexts/AuthContext'
import { addProduct, uploadProductImages } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { FiArrowRight, FiUpload, FiX } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AddProductPage() {
  const { isReady, loading: authLoading } = useRequireRole('seller')
  const { user, profile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (imageFiles.length === 0) {
      toast.error('يرجى إضافة صورة واحدة على الأقل')
      return
    }

    if (!user) return

    setSaving(true)
    try {
      const imageUrls = await uploadProductImages(imageFiles, user.uid)

      await addProduct(user.uid, profile?.username || 'Unknown', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        images: imageUrls,
      })

      toast.success('تم إضافة المنتج بنجاح')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !isReady) return <PageLoadingSpinner />

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition">
            <FiArrowRight size={24} />
          </Link>
          <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">اسم المنتج *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="اسم المنتج"
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">الوصف *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="وصف المنتج التفصيلي"
              rows={6}
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">السعر (ر.ي) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="السعر"
              step="0.01"
              min="0"
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold">الصور *</label>

            {/* Upload Area */}
            <label className="block border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-white/40 transition">
              <div className="space-y-2">
                <FiUpload className="mx-auto" size={40} />
                <p className="font-semibold">انقر لتحميل الصور</p>
                <p className="text-sm text-white/60">أو اسحب الصور هنا</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-[#1a0a0a] group"
                  >
                    <Image
                      src={preview}
                      alt={`صورة ${idx + 1}`}
                      fill
                      className="object-cover group-hover:opacity-70 transition"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={28} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-xl transition"
            >
              {saving ? 'جاري الحفظ...' : 'إضافة المنتج'}
            </button>
            <Link
              href="/dashboard"
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
