'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GitHubFile } from '@/lib/github'
import { estimateReadingTime } from '@/lib/reading-time'
import { getStorageKey, loadProgress } from '@/lib/reading-progress'
import { AbstractLineSvg } from '@/components/abstract-line-svg'

/**
 * 若标题中包含书名号《》，则只提取书名显示（不含《》）；否则原样返回
 */
function formatDisplayTitle(rawTitle: string): string {
  const matches = rawTitle.matchAll(/《([^》]+)》/g)
  const titles = [...matches].map((m) => m[1])
  return titles.length > 0 ? titles.join(' ') : rawTitle
}

interface BookCoverProps {
  book: GitHubFile
  author: string
  repoKey: string
  onClick: () => void
}

export function BookCover({ book, author, repoKey, onClick }: BookCoverProps) {
  const rawTitle = book.name.replace(/\.(txt|md)$/, '')
  const title = formatDisplayTitle(rawTitle)
  const sizeKb = (book.size / 1024).toFixed(1)
  const readingTime = estimateReadingTime(book.size)

  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const key = getStorageKey(repoKey, author, book.name)
    const ratio = loadProgress(key)
    setProgress(Math.round(ratio * 1000) / 10)
  }, [repoKey, author, book.name])

  return (
    <div className="w-full perspective-[1200px] [perspective-origin:center_center]">
      <div
        onClick={onClick}
        className="group shadow-[-6px_0px_20px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_28px_-4px_rgba(0,0,0,0.2)] relative w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm overflow-visible transition-all duration-300 ease-out origin-[50%_50%] hover:shadow-xl active:scale-[0.98] [transform-style:preserve-3d] hover:rotate-y-[0deg] rotate-y-[25deg] hover:scale-95 scale-80"
      >
        {/* 书籍封面 - 整体 3D 效果：以书中心为轴，hover 时书向前倾斜如平放 */}
        <div className="aspect-[3/4] flex flex-col relative bg-gradient-to-b from-amber-50 to-amber-100/80 dark:from-amber-950/20 dark:to-amber-900/25 border border-amber-200/80 dark:border-amber-800/20 rounded-sm overflow-hidden">
        <AbstractLineSvg seed={rawTitle} />
        {/* 书脊效果 - 左侧浅色边 */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-800/30 dark:to-amber-900/25 z-10"
          aria-hidden
        />

        {/* 封面内容 */}
        <div className="flex-1 flex flex-col items-left justify-start p-4 md:p-8 relative z-10">
          <b className="font-serif font-bold font-semibold text-3xl text-left line-clamp-3 break-words leading-relaxed text-amber-800 dark:text-amber-300 text-center">
            {title}
          </b>
        </div>

        {/* 底部信息 - 有进度时用进度条替代上边框 */}
        <div
          className={cn(
            'flex flex-col gap-2 px-3 py-2 bg-amber-100/50 dark:bg-amber-900/20',
            progress > 0
              ? ''
              : 'border-t border-amber-200/90 dark:border-amber-800/20'
          )}
        >
          {progress > 0 && (
            <div className="h-0.5 min-w-0 -mx-3 -mt-2 overflow-hidden bg-amber-200/90 dark:bg-amber-800/30">
              <div
                className="h-full bg-amber-500/80 dark:bg-amber-500/70 transition-[width] duration-150"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-amber-800 dark:text-amber-400">
              {readingTime}
            </span>
            <div className="flex items-center gap-2">
            {/* <span className="text-[10px] text-amber-800 dark:text-amber-500/90">
              {sizeKb} KB
            </span> */}

              {progress > 0 && (
              <span className="flex items-center gap-1 text-[10px] tabular-nums text-amber-800 dark:text-amber-400">
                <Eye className="size-3 shrink-0" />
                {progress.toFixed(0)}%
              </span>
              )}

            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
