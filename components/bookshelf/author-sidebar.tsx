'use client'

import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GitHubFile } from '@/lib/github'

interface AuthorSidebarProps {
  authors: GitHubFile[]
  selectedAuthor: string
  loading: boolean
  onSelect: (name: string) => void
}

export function AuthorSidebar({
  authors,
  selectedAuthor,
  loading,
  onSelect,
}: AuthorSidebarProps) {
  return (
    <aside className="w-full md:w-56 lg:w-64 shrink-0 border rounded-xl bg-card">
      <div className="p-3 border-b bg-muted/50">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          选择作家
        </h2>
      </div>
      <nav className="p-2">
        {authors.map((item) => (
          <button
            key={item.path}
            onClick={() => onSelect(item.name)}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              selectedAuthor === item.name
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {item.name}
          </button>
        ))}
        {authors.length === 0 && !loading && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>暂无作家</p>
          </div>
        )}
      </nav>
    </aside>
  )
}
