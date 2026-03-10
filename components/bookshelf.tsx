
'use client'

import { useState, useEffect } from 'react'
import { Folder, FileText, ArrowLeft, BookOpen, ChevronRight, Home, Loader2, Book } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { getRepoContentsAction, getFileContentAction } from "@/app/actions"
import { GitHubFile, parseGitHubUrl } from "@/lib/github"

interface BookshelfProps {
  initialRepoUrl?: string
}

export function Bookshelf({ initialRepoUrl = "https://github.com/VeejaLiu/ScienceFictionCollection" }: BookshelfProps) {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [contents, setContents] = useState<GitHubFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'shelf' | 'reader'>('shelf')
  const [currentFile, setCurrentFile] = useState<GitHubFile | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)

  useEffect(() => {
    if (repoUrl) {
      loadContents(repoUrl, currentPath.join('/'))
    }
  }, [repoUrl, currentPath]) // Only fetch when these change

  const loadContents = async (url: string, path: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getRepoContentsAction(url, path)
      if (result.error) {
        setError(result.error)
        setContents([])
      } else {
        setContents(result.contents || [])
      }
    } catch (e) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleFolderClick = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  const handleFileClick = async (file: GitHubFile) => {
    if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      setLoading(true)
      setCurrentFile(file)
      try {
        if (file.download_url) {
            const result = await getFileContentAction(file.download_url)
            if (result.error) {
                setError(result.error)
            } else {
                setFileContent(result.content || "")
                setViewMode('reader')
            }
        } else {
            setError("Cannot download file")
        }
      } catch (e) {
        setError("Failed to load file content")
      } finally {
        setLoading(false)
      }
    } else {
      // Maybe handle other file types later
      alert("Only .txt and .md files are supported for reading right now.")
    }
  }

  const handleBack = () => {
    if (viewMode === 'reader') {
      setViewMode('shelf')
      setFileContent(null)
      setCurrentFile(null)
    } else if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const handleHome = () => {
    setViewMode('shelf')
    setCurrentPath([])
    setFileContent(null)
    setCurrentFile(null)
  }

  const repoInfo = parseGitHubUrl(repoUrl)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto p-4 gap-4">
      {/* Header / Navigation */}
      <div className="flex items-center gap-2 mb-4 p-4 bg-background border rounded-lg shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleHome} disabled={loading}>
          <Home className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground overflow-hidden">
            <span className="font-semibold text-foreground whitespace-nowrap">
                {repoInfo ? `${repoInfo.repo}` : 'Bookshelf'}
            </span>
            {currentPath.map((part, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4" />
                    <span className="whitespace-nowrap">{part}</span>
                </div>
            ))}
            {currentFile && viewMode === 'reader' && (
                <div className="flex items-center font-medium text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{currentFile.name}</span>
                </div>
            )}
        </div>

        <div className="ml-auto flex gap-2">
            <Input 
                value={repoUrl} 
                onChange={(e) => setRepoUrl(e.target.value)} 
                placeholder="GitHub Repo URL"
                className="w-[300px]"
            />
            <Button onClick={() => loadContents(repoUrl, "")} disabled={loading}>
                Load
            </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {error && (
            <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                Error: {error}
            </div>
        )}

        {!loading && !error && viewMode === 'shelf' && (
            <ScrollArea className="h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                    {/* Back Button for subdirectories */}
                    {currentPath.length > 0 && (
                        <Card 
                            className="cursor-pointer hover:bg-accent transition-colors flex flex-col items-center justify-center h-[200px] border-dashed"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="h-12 w-12 text-muted-foreground mb-2" />
                            <span className="font-medium text-muted-foreground">Back</span>
                        </Card>
                    )}

                    {contents.map((item) => (
                        <Card 
                            key={item.path} 
                            className={cn(
                                "cursor-pointer hover:shadow-md transition-all group overflow-hidden relative h-[200px] flex flex-col",
                                item.type === 'dir' ? "bg-amber-50/50 hover:bg-amber-100/50 dark:bg-amber-950/10" : "bg-white dark:bg-zinc-900"
                            )}
                            onClick={() => item.type === 'dir' ? handleFolderClick(item.name) : handleFileClick(item)}
                        >
                            <div className={cn(
                                "h-2 w-full absolute top-0 left-0",
                                item.type === 'dir' ? "bg-amber-400" : "bg-blue-400"
                            )} />
                            
                            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                {item.type === 'dir' ? (
                                    <Folder className="h-16 w-16 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Book className="h-16 w-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                                )}
                                <h3 className="font-medium line-clamp-2 text-sm break-words w-full">
                                    {item.name.replace(/\.(txt|md)$/, '')}
                                </h3>
                                {item.type === 'file' && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {(item.size / 1024).toFixed(1)} KB
                                    </span>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    
                    {contents.length === 0 && !loading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                            <p>This shelf is empty.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        )}

        {!loading && !error && viewMode === 'reader' && fileContent && (
            <div className="h-full flex flex-col bg-amber-50 dark:bg-zinc-950 rounded-lg shadow-inner overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                    <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Shelf
                    </Button>
                    <span className="font-serif font-bold text-lg truncate px-4">
                        {currentFile?.name.replace(/\.(txt|md)$/, '')}
                    </span>
                    <div className="w-[100px]"></div> {/* Spacer for alignment */}
                </div>
                <ScrollArea className="flex-1">
                    <div className="max-w-3xl mx-auto p-8 md:p-12 lg:p-16">
                        <article className="prose prose-lg dark:prose-invert prose-stone mx-auto font-serif leading-relaxed whitespace-pre-wrap">
                            {fileContent}
                        </article>
                    </div>
                </ScrollArea>
            </div>
        )}
      </div>
    </div>
  )
}
