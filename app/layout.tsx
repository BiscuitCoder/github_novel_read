import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub 小说阅读器 | 输入带 txt 的仓库地址，自动生成分类与阅读页面',
  description: 'GitHub 小说阅读器，输入带 txt 的仓库地址，自动生成分类与阅读页面。',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
