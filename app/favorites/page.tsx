'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useRequireAuth } from '@/lib/hooks/useAuth'
import { PageLoadingSpinner, LoadingSpinner } from '@/components/Loaders'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getUserFavorites, getAllProducts, Product } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import { FiHeart } from 'react-icons/fi'

export default function FavoritesPage() {
  const { isReady, loading: authLoading } = useRequireAuth()
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)
      const favoriteIds = await getUserFavorites(user.uid)
      const allProducts = await getAllProducts()
      const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id || ''))
      setFavorites(favoriteProducts)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isReady) return <PageLoadingSpinner />

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">المفضلة</h1>
          <p className="text-white/60">{favorites.length} منتج في المفضلة</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a0a0a] p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-white/5">
                <FiHeart className="text-white/40" size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">لا توجد منتجات مفضلة</h3>
              <p className="text-white/60">أضف منتجات إلى المفضلة لمتابعتها لاحقاً</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}
