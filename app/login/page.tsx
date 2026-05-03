'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loginUser, loginWithGoogle, setupPersistence } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { FaGoogle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { PageLoadingSpinner } from '@/components/Loaders'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    setupPersistence()
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await loginUser(email, password)
      toast.success('تم تسجيل الدخول بنجاح')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)

    try {
      await loginWithGoogle()
      toast.success('تم تسجيل الدخول بنجاح')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  if (authLoading) return <PageLoadingSpinner />

  if (user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#040202] via-[#120404] to-[#1a0d0d] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 hover:opacity-80 transition">
            <FiArrowRight className="text-red-500" size={20} />
            <span className="text-sm text-white/60">العودة للرئيسية</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">مرحباً بعودتك</h1>
          <p className="text-white/60">سجل دخولك للمتابعة</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-[#120404]/95 shadow-2xl backdrop-blur-xl p-8 space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">البريد الإلكتروني</label>
            <div className="relative">
              <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">كلمة المرور</label>
            <div className="relative">
              <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a0a0a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#120404] px-2 text-white/60">أو</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <FaGoogle size={18} />
            {googleLoading ? 'جاري الدخول...' : 'تسجيل الدخول عبر Google'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-red-500 hover:text-red-400 font-semibold transition">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </main>
  )
}
                      inputBackground: '#0b0b0b',
                      inputBorder: '#ffffff20',
                      inputBorderFocus: '#ef4444',
                      inputText: '#f8fafc',
                      inputLabelText: '#f8fafc',
                      inputPlaceholder: '#cbd5e1',
                      messageText: '#ffffff',
                      messageBackground: '#111111',
                      messageBorder: '#ffffff1a',
                      anchorTextColor: '#f87171',
                      anchorTextHoverColor: '#ff9aa2',
                    },
                    radii: {
                      borderRadiusButton: '1.5rem',
                      buttonBorderRadius: '1.5rem',
                      inputBorderRadius: '1.5rem',
                    },
                  },
                },
              }}
              theme="dark"
              providers={[]}
              view="sign_in"
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'البريد الإلكتروني',
                    password_label: 'كلمة المرور',
                    email_input_placeholder: 'example@yemcart.com',
                    password_input_placeholder: '••••••••',
                    button_label: 'تسجيل الدخول',
                    link_text: 'إنشاء حساب جديد',
                  },
                },
              }}
            />
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            بعد تسجيل الدخول، سيتم تحويلك تلقائياً إلى لوحة التحكم.
          </p>
        </div>
      </div>
    </main>
  )
}
