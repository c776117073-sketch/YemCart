'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { getStoreByUserId, getStoreProducts, Product } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import { PageLoadingSpinner, LoadingSpinner } from '@/components/Loaders'
import Image from 'next/image'

interface StoreData {
  username: string
  bio?: string
  avatar?: string
  coverImage?: string
  email: string
}

export default function StorePage() {
  const params = useParams()
  const storeId = params.id as string
  const [store, setStore] = useState<StoreData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStore()
  }, [storeId])

  const fetchStore = async () => {
    try {
      setLoading(true)
      const storeData = await getStoreByUserId(storeId)
      setStore(storeData as StoreData)

      const storeProducts = await getStoreProducts(storeId)
      setProducts(storeProducts)
    } catch (error) {
      console.error('Error fetching store:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoadingSpinner />

  if (!store)
    return (
      <main className="min-h-screen bg-[#040202] text-white">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-white/60 text-lg">المتجر غير موجود</p>
        </div>
        <BottomNav />
      </main>
    )

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="space-y-8">
        {/* Store Header */}
        <div>
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-red-500/20 to-red-600/20">
            {store.coverImage && (
              <Image
                src={store.coverImage}
                alt="غلاف المتجر"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Store Info */}
          <div className="max-w-6xl mx-auto px-4 relative -mt-16 mb-8">
            <div className="flex gap-6 items-end">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-2xl border-4 border-[#040202] bg-gradient-to-br from-red-500 to-red-600 flex-shrink-0 overflow-hidden">
                {store.avatar ? (
                  <Image
                    src={store.avatar}
                    alt="صورة المتجر"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                    {store.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pb-4 space-y-2">
                <h1 className="text-3xl font-bold">{store.username}</h1>
                {store.bio && <p className="text-white/70">{store.bio}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">المنتجات</h2>
            <span className="text-white/60 text-sm">{products.length} منتج</span>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-12 text-center">
              <p className="text-white/60">لا توجد منتجات في هذا المتجر</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </section>

      <BottomNav />
    </main>
  )
}
