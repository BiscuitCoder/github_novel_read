'use client'

import { ReadingProgressBar } from './reading-progress-bar'

interface BookReaderProps {
  title: string
  author: string
  content: string
}

export function BookReader({ title, author, content }: BookReaderProps) {
  return (
    <div className="flex-1 flex flex-col bg-amber-50 dark:bg-amber-950/30 rounded-xl shadow-inner overflow-hidden border min-h-[400px]">
      <ReadingProgressBar>
        <div className="max-w-3xl mx-auto p-6 md:p-10 lg:p-14">
          <div className="mb-8 pb-6 border-b border-border text-center">
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-3">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground font-serif italic">
              {author ? `作者：${author}` : '作者未知'}
            </p>
          </div>
          <article className="prose prose-lg dark:prose-invert prose-stone mx-auto font-serif leading-loose whitespace-pre-wrap text-justify">
            {content}
          </article>
        </div>
      </ReadingProgressBar>
    </div>
  )
}
