'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import ProductCard from '@/components/ProductCard'
import { getAllProducts, Product, searchProducts } from '@/lib/db'
import { LoadingSpinner } from '@/components/Loaders'
import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    setLoading(true)
    try {
      if (!term.trim()) {
        await fetchProducts()
      } else {
        const results = await searchProducts(term)
        setProducts(results)
      }
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = searchTerm ? products : products

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      {/* Search Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Search Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] overflow-hidden">
          <div className="flex items-center px-6 py-4 gap-4">
            <FiSearch className="text-white/40" size={24} />
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-lg"
            />
            {searchTerm && (
              <button onClick={() => handleSearch('')} className="text-white/60 hover:text-white transition">
                <FiX size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {searchTerm ? `نتائج البحث عن: ${searchTerm}` : 'جميع المنتجات'}
          </h2>
          {filteredProducts.length > 0 && (
            <span className="text-white/60 text-sm">{filteredProducts.length} منتج</span>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4">
        {loading ? (
          <LoadingSpinner />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {searchTerm ? 'لا توجد نتائج لبحثك' : 'لا توجد منتجات حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}
