'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export const useRequireAuth = (redirectTo = '/login') => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else {
        setIsReady(true)
      }
    }
  }, [user, loading, router, redirectTo])

  return { isReady, loading }
}

export const useRequireRole = (requiredRole: 'buyer' | 'seller', redirectTo = '/') => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (profile?.role !== requiredRole) {
        router.push(redirectTo)
      } else {
        setIsReady(true)
      }
    }
  }, [user, profile, loading, router, requiredRole, redirectTo])

  return { isReady, loading }
}

export const useRequireVerification = () => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!profile?.emailVerified) {
        router.push('/verify-email')
      } else {
        setIsReady(true)
      }
    }
  }, [user, profile, loading, router])

  return { isReady, loading }
}
