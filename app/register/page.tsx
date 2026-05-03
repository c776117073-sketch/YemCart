'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registerUser, setupPersistence } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { PageLoadingSpinner } from '@/components/Loaders'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'buyer' as 'buyer' | 'seller',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    setupPersistence()
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email || !formData.password || !formData.username) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة')
      return
    }

    if (formData.username.length < 3) {
      toast.error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      await registerUser(formData.email, formData.password, formData.username, formData.role)
      toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكد')
      router.push('/verify-email')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <PageLoadingSpinner />

  if (user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#040202] via-[#120404] to-[#1a0d0d] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 hover:opacity-80 transition">
            <FiArrowRight className="text-red-500" size={20} />
            <span className="text-sm text-white/60">العودة للرئيسية</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">إنشاء حساب</h1>
          <p className="text-white/60">ابدأ رحلتك معنا اليوم</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-[#120404]/95 shadow-2xl backdrop-blur-xl p-8 space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">البريد الإلكتروني</label>
            <div className="relative">
              <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">اسم المستخدم</label>
            <div className="relative">
              <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="اسم المستخدم"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">نوع الحساب</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 transition"
            >
              <option value="buyer">مشتري</option>
              <option value="seller">بائع</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">كلمة المرور</label>
            <div className="relative">
              <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="password"
                placeholder="كلمة مرور قوية (6 أحرف على الأقل)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">تأكيد كلمة المرور</label>
            <div className="relative">
              <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold transition">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  )
}
