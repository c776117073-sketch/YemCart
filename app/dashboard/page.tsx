'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { useRequireRole } from '@/lib/hooks/useAuth'
import { PageLoadingSpinner, LoadingSpinner } from '@/components/Loaders'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getProductsByUser, addProduct, updateProduct, deleteProduct, uploadProductImages, Product } from '@/lib/db'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function DashboardPage() {
  const { isReady, loading: authLoading } = useRequireRole('seller')
  const { user, profile } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'seller') {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      if (!user) return
      const data = await getProductsByUser(user.uid)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('خطأ في تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return

    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      await deleteProduct(productId, user.uid)
      setProducts(products.filter((p) => p.id !== productId))
      toast.success('تم حذف المنتج بنجاح')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (authLoading || !isReady) return <PageLoadingSpinner />

  return (
    <main className="min-h-screen bg-[#040202] text-white pb-24">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">لوحة التحكم</h1>
            <p className="text-white/60">إدارة منتجات متجرك</p>
          </div>
          <Link
            href="/dashboard/add-product"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
          >
            <FiPlus size={20} />
            إضافة منتج
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 space-y-2">
            <p className="text-white/60 text-sm">إجمالي المنتجات</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 space-y-2">
            <p className="text-white/60 text-sm">الإجمالي</p>
            <p className="text-3xl font-bold">
              {products.reduce((sum, p) => sum + p.price, 0).toFixed(0)} ر.ي
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 space-y-2">
            <p className="text-white/60 text-sm">المتجر</p>
            <Link
              href={`/store/${user?.uid}`}
              className="text-red-500 hover:text-red-400 font-semibold transition text-sm flex items-center gap-1"
            >
              عرض المتجر <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">منتجاتك</h2>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-12 text-center">
              <p className="text-white/60 mb-4">لا توجد منتجات حالياً</p>
              <Link
                href="/dashboard/add-product"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
              >
                <FiPlus size={20} />
                إضافة أول منتج
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 flex gap-6 items-center"
                >
                  {/* Image */}
                  {product.images?.[0] && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>
                    <p className="text-red-500 font-bold">{product.price.toFixed(0)} ر.ي</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/edit/${product.id}`}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <FiEdit className="text-blue-500" size={20} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id!)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <FiTrash2 className="text-red-500" size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          throw new Error(sessionError.message)
        }

        setSession(sessionData.session)
        const ownerId = sessionData.session?.user?.id
        if (!ownerId) {
          throw new Error('الرجاء تسجيل الدخول للوصول إلى لوحة التحكم.')
        }

        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id, name, slug, primary_color')
          .eq('owner_id', ownerId)
          .limit(1)
          .single()

        if (storeError) {
          throw new Error(storeError.message)
        }

        setStore(storeData)
      } catch (catchError) {
        setError(catchError instanceof Error ? catchError.message : 'تعذر تحميل بيانات المتجر')
      } finally {
        setLoading(false)
      }
    }

    loadSellerStore()
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        setStore(null)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const handleInputChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const uploadFilesToStorage = async (files: FileList, storeId: string) => {
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-_]/g, '-')}`
      const path = `products/${storeId}/${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const publicUrlResponse = supabase.storage.from('products').getPublicUrl(path)
      const publicUrl = publicUrlResponse.data?.publicUrl

      if (!publicUrl) {
        throw new Error('فشل إنشاء رابط الصورة')
      }

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!store) {
      setError('لم يتم العثور على متجر مرتبط بحسابك.')
      setLoading(false)
      return
    }

    try {
      const priceValue = Number(form.price)
      const stockValue = Number(form.stock)

      if (!form.title.trim() || Number.isNaN(priceValue) || Number.isNaN(stockValue)) {
        throw new Error('يرجى ملء الحقول الأساسية بشكل صحيح.')
      }

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            store_id: store.id,
            title: form.title,
            description: form.description,
            price: priceValue,
            sku: form.sku,
            stock: stockValue,
            category: form.category,
            tags,
          },
        ])
        .select('*')

      if (productError || !productData || productData.length === 0) {
        throw new Error(productError?.message || 'فشل إنشاء المنتج.')
      }

      const product = productData[0]
      if (!product) {
        throw new Error('فشل الحصول على بيانات المنتج.')
      }
      const imageUrls = images ? await uploadFilesToStorage(images, store.id) : []

      for (const url of imageUrls) {
        const { error: imageError } = await supabase.from('product_images').insert([
          {
            product_id: product.id,
            image_url: url,
            is_primary: false,
          },
        ])

        if (imageError) {
          throw new Error(imageError.message)
        }
      }

      setSuccess('تم إضافة المنتج بنجاح إلى متجرك.')
      setForm({ title: '', description: '', price: '', sku: '', stock: '1', category: '', tags: '' })
      setImages(null)
    } catch (catchError) {
      setError(catchError instanceof Error ? catchError.message : 'حدث خطأ أثناء إضافة المنتج.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[28px] border border-red-600/20 bg-[#170606]/95 p-6 shadow-[0_24px_100px_rgba(255,0,0,0.18)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-300">Seller Control Center</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">مرحباً بكي في لوحة تحكم المتجر</h1>
            <p className="mt-3 max-w-2xl text-white/70">
              أضف منتجاتك الآن بجودة احترافية واحفظ تجربتك سلسة وسريعة لمستخدمي اليمن.
            </p>
          </div>
          <div className="rounded-3xl bg-[#0d0909] px-5 py-4 text-right text-sm text-white/80 ring-1 ring-red-700/25">
            <p className="font-semibold text-red-200">متجرك الحالي</p>
            <p className="mt-2 text-lg text-white">{store ? store.name : 'تحميل المتجر...'}</p>
            <p className="mt-1 text-sm text-white/60">{store ? store.slug : 'انتظر لحظة'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#120404]/95 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.28)]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">إضافة منتج جديد</h2>
              <p className="mt-2 text-sm text-white/70">نموذج منتج متكامل مع دعم صور Supabase Storage.</p>
            </div>
            <span className="rounded-3xl bg-red-600/10 px-4 py-2 text-sm font-medium text-red-200">
              {store ? 'متجر مُفعَّل' : 'يرجى تسجيل الدخول'}
            </span>
          </div>

          {!store && !loading ? (
            <div className="mb-8 rounded-3xl border border-red-500/20 bg-[#120404]/90 p-6 text-center text-white/80">
              <p className="text-lg font-semibold text-white">يجب تسجيل الدخول أولاً لإضافة المنتجات.</p>
              <p className="mt-2 text-sm text-white/70">انتقل إلى صفحة تسجيل الدخول ثم عُد إلى لوحة التحكم.</p>
              <Link
                href="/login"
                className="mt-5 inline-flex rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                تسجيل الدخول الآن
              </Link>
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-white/80">
                عنوان المنتج
                <input
                  value={form.title}
                  onChange={(event) => handleInputChange('title', event.target.value)}
                  required
                  disabled={!store}
                  className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                الفئة
                <input
                  value={form.category}
                  onChange={(event) => handleInputChange('category', event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder="إلكترونيات، أزياء، جمال"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-white/80">
              الوصف
              <textarea
                value={form.description}
                onChange={(event) => handleInputChange('description', event.target.value)}
                rows={5}
                disabled={!store}
                className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                placeholder="اكتب وصفاً مميزاً لمنتجك"
              />
            </label>

            <div className="grid gap-5 lg:grid-cols-3">
              <label className="space-y-2 text-sm text-white/80">
                السعر (ريال)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => handleInputChange('price', event.target.value)}
                  required
                  disabled={!store}
                  className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                المخزون
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => handleInputChange('stock', event.target.value)}
                  required
                  disabled={!store}
                  className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                SKU
                <input
                  value={form.sku}
                  onChange={(event) => handleInputChange('sku', event.target.value)}
                  disabled={!store}
                  className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-white/80">
              الوسوم
              <input
                value={form.tags}
                onChange={(event) => handleInputChange('tags', event.target.value)}
                disabled={!store}
                className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
                placeholder="مثال: تقنية، منزلي، هدايا"
              />
            </label>

            <label className="space-y-2 text-sm text-white/80">
              صور المنتج
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={!store}
                onChange={(event) => setImages(event.target.files)}
                className="w-full rounded-3xl border border-white/10 bg-[#090404] px-4 py-3 text-white outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-red-600/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {success && <p className="text-sm text-emerald-400">{success}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || !store}
                className="inline-flex items-center justify-center rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/50"
              >
                {loading ? 'جاري الحفظ...' : 'إضافة المنتج'}
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-[28px] border border-red-700/20 bg-[#110606]/95 p-6 shadow-[inset_0_0_40px_rgba(255,0,0,0.08)]">
          <div className="rounded-3xl bg-[#0f0b0b]/95 p-5 ring-1 ring-red-600/20">
            <p className="text-sm uppercase tracking-[0.24em] text-red-300">إرشادات لرفع الصور</p>
            <ul className="mt-4 space-y-3 text-white/70">
              <li>استخدم صوراً لا تتجاوز 1-2 ميجابايت لكل صورة.</li>
              <li>أضف أكثر من صورة لتحسين صفحة المنتج.</li>
              <li>رابط تخزين الصور يتم تخزينه تلقائياً في Supabase Storage.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-[#090404]/95 p-5">
            <h3 className="text-lg font-semibold text-white">تفاصيل المتجر</h3>
            {store ? (
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>اسم المتجر: <span className="font-medium text-white">{store.name}</span></p>
                <p>رابط المتجر: <span className="font-medium text-white">{store.slug}.yemcart.com</span></p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/70">جارٍ تحميل بيانات المتجر...</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
