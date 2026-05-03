'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { Product } from '@/lib/db'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useFavorites } from '@/lib/hooks/useFavorites'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const { isFav, toggleFavorite } = useFavorites(user?.uid)
  const isFavorite = isFav(product.id || '')

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('قم بتسجيل الدخول أولاً')
      return
    }
    await toggleFavorite(product.id || '')
    toast.success(isFavorite ? 'تم الحذف من المفضلة' : 'تم الإضافة إلى المفضلة')
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 mb-4">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
          >
            {isFavorite ? <FaHeart className="text-red-500" size={18} /> : <FiHeart className="text-white" size={18} />}
          </button>

          {/* Image Count Badge */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-white">
              +{product.images.length - 1}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Seller Name */}
          <p className="text-xs text-white/50 line-clamp-1">{product.sellerUsername}</p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-red-400 transition">
            {product.title}
          </h3>

          {/* Price */}
          <p className="text-base font-bold text-red-500">{product.price.toFixed(0)} ر.ي</p>
        </div>
      </div>
    </Link>
  )
}
