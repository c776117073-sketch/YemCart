import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  await supabase.auth.getUser()

  const hostHeader = request.headers.get('host') || ''
  const hostname = (hostHeader.split(':')[0] || '').toLowerCase()
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'yemcart.com'
  const cleanMainDomain = mainDomain.toLowerCase()

  const isMainDomain = hostname === cleanMainDomain || hostname === `www.${cleanMainDomain}`
  const isSubdomain = hostname.endsWith(`.${cleanMainDomain}`) && !isMainDomain

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${cleanMainDomain}`, '')
    if (subdomain && subdomain !== 'www') {
      const url = request.nextUrl.clone()
      if (!url.pathname.startsWith(`/store/${subdomain}`)) {
        url.pathname = `/store/${subdomain}${url.pathname}`
      }
      return NextResponse.rewrite(url)
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}