'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBookshelf } from './use-bookshelf'
import { RepoInput } from './repo-input'
import { AuthorSidebar } from './author-sidebar'
import { BooksGrid } from './books-grid'
import { BookReader } from './book-reader'

interface BookshelfProps {
  initialRepoUrl?: string
  mode?: 'home' | 'author' | 'book'
}

export function Bookshelf({
  initialRepoUrl = 'https://github.com/VeejaLiu/ScienceFictionCollection',
  mode = 'home',
}: BookshelfProps) {
  const {
    repoUrl,
    author,
    book,
    authors,
    books,
    loading,
    error,
    fileContent,
    currentFile,
    isReaderMode,
    handleConfirm,
    handleAuthorSelect,
    handleBookClick,
  } = useBookshelf(mode, initialRepoUrl)

  return (
    <div
      className={cn(
        'flex flex-col w-full p-4 gap-4',
        'min-h-[calc(100vh-8rem)]'
      )}
    >
      {mode === 'home' && (
        <RepoInput repoUrl={repoUrl} onConfirm={handleConfirm} />
      )}

      <div className="relative flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-50 backdrop-blur-sm rounded-xl">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-4 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!error && !isReaderMode && (
          <>
            <AuthorSidebar
              authors={authors}
              selectedAuthor={author}
              loading={loading}
              onSelect={handleAuthorSelect}
            />
            <BooksGrid
              books={books}
              author={author}
              repoUrl={repoUrl}
              initialRepoUrl={initialRepoUrl}
              onBookClick={handleBookClick}
            />
          </>
        )}

        {!loading && !error && isReaderMode && fileContent && (
          <BookReader
            title={
              currentFile?.name.replace(/\.(txt|md)$/, '') ||
              book.replace(/\.(txt|md)$/, '')
            }
            author={author}
            content={fileContent}
          />
        )}
      </div>
    </div>
  )
}
