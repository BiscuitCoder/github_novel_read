import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import localFont from 'next/font/local'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const shanhaiFont = localFont({
  src: '../fonts/AaGuDianKeBenSong-2.ttf',
  variable: '--font-shanhai',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'KK 科幻空间 | 科幻作家作品免费在线阅读',
    template: '%s | KK 科幻空间',
  },
  description:
    'KK 科幻空间收录众多科幻作家的经典作品，刘慈欣、何夕、王晋康等名家小说免费在线阅读，无广告、无付费，畅享硬科幻、赛博朋克、太空歌剧等全品类科幻小说。',
  keywords: ['科幻小说免费', '科幻作家', '科幻在线阅读', '免费科幻', '硬科幻', '赛博朋克'],
  authors: [{ name: 'KK 科幻空间' }],
  openGraph: {
    title: 'KK 科幻空间 | 科幻作家作品免费在线阅读',
    description:
      '收录各类科幻作家小说，免费在线阅读，无付费无广告，畅享刘慈欣、何夕等名家科幻作品。',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png?time=1',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png?time=1',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.png?time=1',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png?time=1',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={shanhaiFont.variable}>
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
