'use client'

import { BookOpen } from 'lucide-react'
import { GitHubFile } from '@/lib/github'
import { BookCover } from './book-cover'

interface BooksGridProps {
  books: GitHubFile[]
  author: string
  repoUrl?: string
  initialRepoUrl?: string
  onBookClick: (file: GitHubFile) => void
}

export function BooksGrid({
  books,
  author,
  repoUrl = '',
  initialRepoUrl = '',
  onBookClick,
}: BooksGridProps) {
  const repoKey = repoUrl && repoUrl !== initialRepoUrl ? repoUrl : ''
  return (
    <div className="flex-1 min-w-0 border rounded-xl">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-semibold text-sm">
          {author ? `${author} 的 ${books.length} 部作品` : '作品列表'}
        </h2>
      </div>
      <div className="p-4">
        {!author ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-sm">请从左侧选择一位作家</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((item) => (
              <BookCover
                key={item.path}
                book={item}
                author={author}
                repoKey={repoKey}
                onClick={() => onBookClick(item)}
              />
            ))}
            {books.length === 0 && author && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-sm">该作家暂无作品</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
