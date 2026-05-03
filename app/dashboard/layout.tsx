import type { ReactNode } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    { label: 'لوحة القيادة', href: '/dashboard' },
    { label: 'المنتجات', href: '/dashboard' },
    { label: 'الطلبات', href: '/dashboard/orders' },
    { label: 'إعدادات المتجر', href: '/dashboard/settings' },
  ]

  return (
    <div className="min-h-screen bg-[#080404] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 lg:px-8">
        <div className="grid flex-1 gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-[32px] border border-red-700/30 bg-[#120707]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-8 space-y-4 border-b border-white/10 pb-6">
              <div className="rounded-3xl bg-red-600/10 p-4 ring-1 ring-red-500/20">
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">YemCart Seller</h2>
                <p className="mt-3 text-xl font-semibold text-white">لوحة تحكم التاجر</p>
              </div>
              <p className="text-sm leading-6 text-white/70">
                واجهة تحكم فخمة لإدارة منتجاتك، الطلبات، ومناطق الشحن.
              </p>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-white/5 bg-[#120707] px-4 py-3 text-sm font-medium text-white transition hover:border-red-500/40 hover:bg-red-600/10 hover:text-red-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10 rounded-3xl border border-red-700/20 bg-[#110606]/95 p-6 text-sm text-white/75 shadow-[inset_0_0_40px_rgba(255,0,0,0.08)]">
              <p className="font-semibold text-red-200">نصائح الأداء</p>
              <ul className="mt-4 space-y-3 list-disc pl-5 leading-7 text-white/70">
                <li>استخدم صور منتجات عالية الدقة بحجم مضغوط.</li>
                <li>أضف وصفاً مختصراً وواضحاً لكل منتج.</li>
                <li>حدّث مخزونك بانتظام لتحسين تجربة العميل.</li>
              </ul>
            </div>
          </aside>

          <main className="rounded-[32px] border border-white/10 bg-[#090404]/95 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.25)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
