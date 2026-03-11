'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GitHubFile } from '@/lib/github'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const isMobile = useIsMobile()

  const authorButton = (item: GitHubFile) => (
    <button
      onClick={() => onSelect(item.name)}
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3',
        selectedAuthor === item.name
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      <span className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
        <Image
          src={`/authors/${item.name}.png`}
          alt={item.name}
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </span>
      <span className="min-w-0 truncate">{item.name}</span>
    </button>
  )

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
          <Fragment key={item.path}>
            {isMobile ? (
              authorButton(item)
            ) : (
              <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                {authorButton(item)}
              </HoverCardTrigger>
              <HoverCardContent side="right" className="w-56 p-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-50 h-50 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={`/authors/${item.name}.png`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-center leading-relaxed">
                    {item.name}
                  </p>
                </div>
              </HoverCardContent>
              </HoverCard>
            )}
          </Fragment>
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
