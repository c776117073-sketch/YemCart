import './globals.css'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'YemCart - منصة التجارة الإلكترونية',
  description: 'منصة التجارة الإلكترونية متعددة البائعين للتجار في اليمن',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#040202] text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" reverseOrder />
        </AuthProvider>
      </body>
    </html>
  )
}
