'use client'

import { Fragment, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Book, BookOpen, Home, Library, Loader2, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { getRepoContentsAction, getFileContentAction } from "@/app/actions"
import { GitHubFile, parseGitHubUrl } from "@/lib/github"

interface BookshelfProps {
  initialRepoUrl?: string
  mode?: 'home' | 'author' | 'book'
}

export function Bookshelf({ initialRepoUrl = "https://github.com/VeejaLiu/ScienceFictionCollection", mode = 'home' }: BookshelfProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const repoUrl = searchParams.get('repo') || initialRepoUrl
  
  // Logic based on mode
  let author = ''
  let book = ''

  if (mode === 'author') {
    author = searchParams.get('name') || ''
  } else if (mode === 'book') {
    author = searchParams.get('author') || ''
    book = searchParams.get('name') || ''
  }

  const [contents, setContents] = useState<GitHubFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<GitHubFile | null>(null)

  const isReaderMode = mode === 'book'
  const repoInfo = parseGitHubUrl(repoUrl)

  useEffect(() => {
    // Validate required params for the mode
    if (mode === 'author' && !author) return
    if (mode === 'book' && (!author || !book)) return

    if (repoUrl) {
      loadData(repoUrl, author, book)
    }
  }, [repoUrl, author, book, mode])

  const loadData = async (url: string, currentAuthor: string, currentBook: string) => {
    setLoading(true)
    setError(null)
    setFileContent(null)
    setCurrentFile(null)

    try {
      if (mode === 'book') {
        const filePath = `${currentAuthor}/${currentBook}`
        const result = await getRepoContentsAction(url, filePath)
        if (result.error) {
          setError(result.error)
          setContents([])
          return
        }

        const data = result.contents
        if (data && !Array.isArray(data) && data.type === 'file') {
          setCurrentFile(data as GitHubFile)
          if (data.download_url) {
            const contentResult = await getFileContentAction(data.download_url)
            if (contentResult.error) {
              setError(contentResult.error)
            } else {
              setFileContent(contentResult.content || "")
            }
          } else {
            setError("无法下载文件")
          }
        }
        return
      }

      // mode 'home' or 'author'
      const path = currentAuthor || ''
      const result = await getRepoContentsAction(url, path)
      
      if (result.error) {
        setError(result.error)
        setContents([])
        return
      }

      const data = result.contents

      if (Array.isArray(data)) {
        if (mode === 'author') {
          // List books
          const files = data.filter((item) => item.type === 'file' && (item.name.endsWith('.txt') || item.name.endsWith('.md')))
          setContents(files)
        } else {
          // List authors (directories)
          const dirs = data.filter((item) => item.type === 'dir')
          setContents(dirs)
        }
      }
    } catch (e) {
      setError("发生未知错误")
    } finally {
      setLoading(false)
    }
  }

  const updateRepo = (newUrl: string) => {
    const params = new URLSearchParams()
    if (newUrl) {
      params.set('repo', newUrl)
    }
    router.push(`/?${params.toString()}`)
  }

  const handleAuthorClick = (name: string) => {
    const params = new URLSearchParams()
    if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
    params.set('name', name)
    router.push(`/author?${params.toString()}`)
  }

  const handleBookClick = (file: GitHubFile) => {
    const params = new URLSearchParams()
    if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
    params.set('author', author)
    params.set('name', file.name)
    router.push(`/book?${params.toString()}`)
  }

  const handleHome = () => {
    const params = new URLSearchParams()
    if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
    router.push(`/?${params.toString()}`)
  }
  
  const handleAuthorBreadcrumb = () => {
     handleAuthorClick(author)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto p-4 gap-4">
      <div className="flex flex-col gap-4 mb-2 p-6 bg-background border rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              {repoInfo ? repoInfo.repo : 'Bookshelf'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Input 
              defaultValue={repoUrl} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateRepo(e.currentTarget.value)
                }
              }}
              onBlur={(e) => {
                if (e.target.value !== repoUrl) {
                  updateRepo(e.target.value)
                }
              }}
              placeholder="GitHub Repo URL"
              className="w-[300px]"
            />
          </div>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                className="cursor-pointer flex items-center gap-1" 
                onClick={handleHome}
              >
                <Home className="h-4 w-4" />
                首页
              </BreadcrumbLink>
            </BreadcrumbItem>

            {mode !== 'home' && author && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {mode === 'book' ? (
                    <BreadcrumbLink className="cursor-pointer" onClick={handleAuthorBreadcrumb}>
                      {author}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold">
                      {author}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )}

            {mode === 'book' && book && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    {book.replace(/\.(txt|md)$/, '')}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )}

        {error && (
            <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
            </div>
        )}

        {!loading && !error && !isReaderMode && (
            <ScrollArea className="h-full">
                <div className="p-1">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">
                            {mode === 'author' ? "作品列表" : "作家列表"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {mode === 'author'
                              ? `当前作者：${author}` 
                              : "选择一个作家进入其作品列表"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {contents.map((item) => (
                            <Card 
                                key={item.path} 
                                className={cn(
                                    "cursor-pointer hover:shadow-lg transition-all group overflow-hidden relative h-[240px] flex flex-col border-2 hover:border-primary/50",
                                    mode === 'author' ? "bg-white dark:bg-zinc-900" : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                                )}
                                onClick={() => mode === 'author' ? handleBookClick(item) : handleAuthorClick(item.name)}
                            >
                                <div className={cn(
                                    "h-3 w-full absolute top-0 left-0",
                                    mode === 'author' ? "bg-blue-500" : "bg-amber-500"
                                )} />
                                
                                <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
                                    <div className={cn(
                                        "p-4 rounded-full transition-transform group-hover:scale-110",
                                        mode === 'author' ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                                    )}>
                                        {mode === 'author' ? <Book className="h-8 w-8" /> : <User className="h-8 w-8" />}
                                    </div>
                                    
                                    <div className="w-full">
                                        <h3 className="font-bold line-clamp-2 text-base break-words w-full leading-tight">
                                            {item.name.replace(/\.(txt|md)$/, '')}
                                        </h3>
                                        {mode === 'author' && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {(item.size / 1024).toFixed(1)} KB
                                            </p>
                                        )}
                                        {mode === 'home' && (
                                            <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                                                作者
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        {contents.length === 0 && !loading && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                                <p>当前列表为空</p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        )}

        {!loading && !error && isReaderMode && fileContent && (
            <div className="h-full flex flex-col bg-amber-50 dark:bg-zinc-950 rounded-lg shadow-inner overflow-hidden border">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-8 md:p-12 lg:p-16">
                         <div className="mb-8 pb-4 border-b border-stone-200 dark:border-stone-800 text-center">
                            <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                                {currentFile?.name.replace(/\.(txt|md)$/, '') || book.replace(/\.(txt|md)$/, '')}
                            </h1>
                            <p className="text-sm text-muted-foreground font-serif italic">
                                {author ? `作者：${author}` : '作者未知'}
                            </p>
                         </div>
                        <article className="prose prose-lg dark:prose-invert prose-stone mx-auto font-serif leading-relaxed whitespace-pre-wrap text-justify">
                            {fileContent}
                        </article>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
