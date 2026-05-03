'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import ProductCard from '@/components/ProductCard'
import { getAllProducts, Product } from '@/lib/db'
import { LoadingSpinner } from '@/components/Loaders'
import { FiArrowLeft } from 'react-icons/fi'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a0a0a] via-[#120404] to-[#0a0a0a] p-8 md:p-12 space-y-6 backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-red-400">منصة التجارة الإلكترونية</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              اكتشف عالماً من المنتجات والمتاجر
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              منصة يمكارت توفر لك تجربة تسوق فريدة مع بائعين موثوقين ومنتجات متنوعة
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition"
            >
              استكشف الآن
              <FiArrowLeft size={20} />
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">المنتجات الحديثة</h2>
          <Link href="/search" className="text-red-500 hover:text-red-400 text-sm font-semibold transition">
            عرض الكل →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/10 via-[#120404] to-[#0a0a0a] p-8 md:p-12 text-center space-y-6 backdrop-blur-xl">
          <h3 className="text-3xl font-bold">هل أنت بائع؟</h3>
          <p className="text-white/70 max-w-2xl mx-auto">
            افتح متجرك الخاص على منصة يمكارت وابدأ في البيع اليوم
          </p>
          <Link
            href="/register?role=seller"
            className="inline-block px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
