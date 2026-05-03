'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { getProduct, Product } from '@/lib/db'
import { useCart } from '@/lib/stores/cartStore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiX } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { PageLoadingSpinner } from '@/components/Loaders'
import toast from 'react-hot-toast'
import { useFavorites } from '@/lib/hooks/useFavorites'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { isFav, toggleFavorite } = useFavorites(user?.uid)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await getProduct(productId)
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      productId: product.id || '',
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
      sellerId: product.sellerId,
      sellerUsername: product.sellerUsername,
    })

    toast.success('تم إضافة المنتج إلى السلة')
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('قم بتسجيل الدخول أولاً')
      return
    }
    await toggleFavorite(product?.id || '')
    toast.success(isFav(product?.id || '') ? 'تم الحذف من المفضلة' : 'تم الإضافة إلى المفضلة')
  }

  if (loading) return <PageLoadingSpinner />

  if (!product)
    return (
      <div className="min-h-screen bg-[#040202] text-white flex items-center justify-center pb-24">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
          <Link href="/search" className="text-red-500 hover:text-red-400">
            العودة للبحث
          </Link>
        </div>
      </div>
    )

  const isFavorite = isFav(product.id || '')

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/search" className="text-white/60 hover:text-white text-sm mb-6 inline-block">
          ← العودة للمنتجات
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl border border-white/10 bg-[#1a0a0a] overflow-hidden group">
              {product.images?.[currentImageIndex] ? (
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">لا توجد صورة</div>
              )}

              {/* Navigation Buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === 0 ? product.images!.length - 1 : prev - 1))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                  >
                    <FiChevronRight size={24} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev === product.images!.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg flex-shrink-0 border-2 overflow-hidden transition ${
                      currentImageIndex === idx ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <Image src={img} alt={`${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Link
                  href={`/store/${product.sellerId}`}
                  className="text-sm text-white/60 hover:text-white transition"
                >
                  {product.sellerUsername}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{product.title}</h1>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-red-500">{product.price.toFixed(0)} ر.ي</div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 space-y-3">
              <h3 className="font-semibold text-lg">وصف المنتج</h3>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition"
              >
                <FiShoppingCart size={20} />
                إضافة للسلة
              </button>
              <button
                onClick={handleFavorite}
                className="py-4 px-6 border border-white/10 hover:border-red-500 text-white font-semibold rounded-xl transition flex items-center gap-2"
              >
                <FaHeart size={20} className={isFavorite ? 'text-red-500' : ''} />
              </button>
            </div>

            {/* Product Info */}
            <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-white/60 text-sm">عدد الصور</p>
                <p className="text-2xl font-bold mt-2">{product.images?.length || 0}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">تاريخ النشر</p>
                <p className="text-sm font-semibold mt-2">
                  {new Date(product.createdAt).toLocaleDateString('ar')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
