'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { resendEmailVerification } from '@/lib/auth'
import { FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { PageLoadingSpinner } from '@/components/Loaders'

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (profile?.emailVerified) {
      router.push('/dashboard')
    }
  }, [profile?.emailVerified, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (countdown > 0) return

    setLoading(true)
    try {
      await resendEmailVerification()
      toast.success('تم إعادة إرسال البريد الإلكتروني')
      setCountdown(60)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <PageLoadingSpinner />

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#040202] via-[#120404] to-[#1a0d0d] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/20 border border-red-500/40">
            <FiMail className="text-red-500" size={48} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">تحقق من بريدك الإلكتروني</h1>
          <p className="text-white/60 text-lg">
            لقد أرسلنا رابط التحقق إلى <br />
            <span className="text-white font-semibold">{user.email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#120404]/95 backdrop-blur-xl p-8 space-y-6">
          <p className="text-white/70 text-sm leading-6">
            يرجى فتح بريدك الإلكتروني والنقر على رابط التحقق لتفعيل حسابك.
          </p>

          <div className="space-y-3">
            <p className="text-white/60 text-sm">لم تتلقى البريد؟</p>
            <button
              onClick={handleResendEmail}
              disabled={countdown > 0 || loading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
            >
              {countdown > 0 ? `إعادة الإرسال بعد ${countdown}ث` : loading ? 'جاري الإرسال...' : 'إعادة إرسال البريد'}
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="text-white/50 text-xs">
          تجديد الصفحة تلقائياً بعد التحقق
        </p>
      </div>
    </main>
  )
}
