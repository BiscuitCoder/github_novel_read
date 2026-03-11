'use client'

import { GitHubFile } from '@/lib/github'
import { estimateReadingTime } from '@/lib/reading-time'

interface BookCoverProps {
  book: GitHubFile
  onClick: () => void
}

export function BookCover({ book, onClick }: BookCoverProps) {
  const title = book.name.replace(/\.(txt|md)$/, '')
  const sizeKb = (book.size / 1024).toFixed(1)
  const readingTime = estimateReadingTime(book.size)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* 书籍封面 - 竖版比例 2:3 */}
      <div className="aspect-[2/3] flex flex-col bg-gradient-to-b from-amber-50 to-amber-100/80 dark:from-amber-950/20 dark:to-amber-900/25 border border-amber-200/80 dark:border-amber-800/20 shadow-sm">
        {/* 书脊效果 - 左侧浅色边 */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-200/60 to-amber-300/50 dark:from-amber-800/30 dark:to-amber-900/25"
          aria-hidden
        />

        {/* 封面内容 */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
          <h3 className="font-serif font-semibold text-2xl line-clamp-3 break-words leading-relaxed text-amber-800 dark:text-amber-300 text-center">
            {title}
          </h3>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-amber-100/50 dark:bg-amber-900/20 border-t border-amber-200/50 dark:border-amber-800/20">
          <span className="text-[10px] text-amber-800 dark:text-amber-400">{readingTime}</span>
          <span className="text-[10px] text-amber-800 dark:text-amber-500/90">{sizeKb} KB</span>
        </div>
      </div>
    </button>
  )
}
