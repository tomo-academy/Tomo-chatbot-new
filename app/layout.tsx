import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/next'

import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import AppSidebar from '@/components/app-sidebar'
import ArtifactRoot from '@/components/artifact/artifact-root'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = '🤖 Tomo AI Chatbot - Advanced AI Assistant'
const description =
  '🚀 Experience the future of AI conversation with Tomo AI Chatbot - Your intelligent, responsive, and feature-rich AI companion for all your questions and tasks.'

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.tomoacademy.site'),
  title,
  description,
  icons: {
    icon: [
      { url: '/apple-touch-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/apple-touch-icon.png',
    other: [
      { url: '/apple-touch-icon.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  openGraph: {
    title,
    description,
    url: 'https://chat.tomoacademy.site',
    siteName: 'Tomo AI Chatbot',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Tomo AI Chatbot - Advanced AI Assistant'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@tomo_academy',
    images: ['/opengraph-image.png']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'light dark'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  let user = null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = await createClient()
    const {
      data: { user: supabaseUser }
    } = await supabase.auth.getUser()
    user = supabaseUser
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen min-h-[100dvh] flex flex-col font-sans antialiased overflow-x-hidden bg-background text-foreground selection:bg-blue-500/20 supports-[height:100dvh]:min-h-[100dvh]',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0 min-h-screen min-h-[100dvh] supports-[height:100dvh]:min-h-[100dvh]">
              <Header user={user} />
              <main className="flex flex-1 min-h-0 relative bg-background">
                <ArtifactRoot>{children}</ArtifactRoot>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
