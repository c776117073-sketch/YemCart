'use client'

import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useCart } from '@/lib/stores/cartStore'
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCart()

  const total = getTotal()

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">سلة التسوق</h1>
          <p className="text-white/60">
            {items.length === 0 ? 'السلة فارغة' : `${items.length} منتج في السلة`}
          </p>
        </div>

        {items.length === 0 ? (
          // Empty Cart
          <div className="rounded-3xl border border-white/10 bg-[#1a0a0a] p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-white/5">
                <FiShoppingCart className="text-white/40" size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">سلتك فارغة</h3>
              <p className="text-white/60">ابدأ التسوق واضف منتجات إلى سلتك</p>
            </div>
            <Link
              href="/search"
              className="inline-block px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
            >
              استكشف المنتجات
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 flex gap-6"
                >
                  {/* Image */}
                  {item.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.sellerUsername}</p>
                    <p className="text-lg font-bold text-red-500">{item.price.toFixed(0)} ر.ي</p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-white/10 rounded transition"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-white/10 rounded transition"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="text-sm text-white/60">
                      {(item.price * item.quantity).toFixed(0)} ر.ي
                    </p>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-400 transition p-2"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 space-y-6 sticky top-20">
                {/* Summary */}
                <div className="space-y-3 pb-6 border-b border-white/10">
                  <div className="flex justify-between text-white/60">
                    <span>المجموع الجزئي</span>
                    <span>{total.toFixed(0)} ر.ي</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>الشحن</span>
                    <span>مجاني</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3">
                    <span>الإجمالي</span>
                    <span className="text-red-500">{total.toFixed(0)} ر.ي</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition">
                  المتابعة للدفع
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/search"
                  className="block text-center py-2 text-white/60 hover:text-white text-sm transition"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}
