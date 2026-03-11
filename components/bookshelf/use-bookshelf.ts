'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRepoContentsAction, getFileContentAction } from '@/app/actions'
import { GitHubFile } from '@/lib/github'

export function useBookshelf(
  mode: 'home' | 'author' | 'book',
  initialRepoUrl: string
) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const repoUrl = searchParams.get('repo') || initialRepoUrl

  let author = ''
  let book = ''
  if (mode === 'author') {
    author = searchParams.get('name') || ''
  } else if (mode === 'book') {
    author = searchParams.get('author') || ''
    book = searchParams.get('name') || ''
  } else {
    author = searchParams.get('author') || ''
  }

  const [authors, setAuthors] = useState<GitHubFile[]>([])
  const [books, setBooks] = useState<GitHubFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<GitHubFile | null>(null)

  const hasAutoSelected = useRef(false)

  useEffect(() => {
    if (!repoUrl || mode !== 'home') return
    hasAutoSelected.current = false

    const loadAuthors = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getRepoContentsAction(repoUrl, '')
        if (result.error) {
          setError(result.error)
          setAuthors([])
          return
        }
        const data = result.contents
        if (Array.isArray(data)) {
          const dirs = data.filter((item) => item.type === 'dir')
          setAuthors(dirs)
          if (!author && dirs.length > 0 && !hasAutoSelected.current) {
            hasAutoSelected.current = true
            const params = new URLSearchParams()
            if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
            params.set('author', dirs[0].name)
            router.replace(`/?${params.toString()}`, { scroll: false })
          }
        }
      } catch (e) {
        setError('发生未知错误')
      } finally {
        setLoading(false)
      }
    }
    loadAuthors()
  }, [repoUrl, mode, author, initialRepoUrl, router])

  useEffect(() => {
    if (!author || (mode !== 'home' && mode !== 'author')) {
      setBooks([])
      return
    }

    const loadBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getRepoContentsAction(repoUrl, author)
        if (result.error) {
          setError(result.error)
          setBooks([])
          return
        }
        const data = result.contents
        if (Array.isArray(data)) {
          const files = data.filter(
            (item) =>
              item.type === 'file' &&
              (item.name.endsWith('.txt') || item.name.endsWith('.md'))
          )
          setBooks(files)
        }
      } catch (e) {
        setError('发生未知错误')
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [repoUrl, author, mode])

  useEffect(() => {
    if (mode !== 'book' || !author || !book) return

    const loadBook = async () => {
      setLoading(true)
      setError(null)
      setFileContent(null)
      setCurrentFile(null)
      try {
        const filePath = `${author}/${book}`
        const result = await getRepoContentsAction(repoUrl, filePath)
        if (result.error) {
          setError(result.error)
          return
        }
        const data = result.contents
        if (
          data &&
          !Array.isArray(data) &&
          data.type === 'file' &&
          data.download_url
        ) {
          setCurrentFile(data as GitHubFile)
          const contentResult = await getFileContentAction(data.download_url)
          if (contentResult.error) {
            setError(contentResult.error)
          } else {
            setFileContent(contentResult.content || '')
          }
        } else {
          setError('无法下载文件')
        }
      } catch (e) {
        setError('发生未知错误')
      } finally {
        setLoading(false)
      }
    }
    loadBook()
  }, [repoUrl, author, book, mode])

  const handleConfirm = (url: string) => {
    const trimmed = url.trim()
    if (trimmed) {
      const params = new URLSearchParams()
      params.set('repo', trimmed)
      router.push(`/?${params.toString()}`)
    }
  }

  const handleAuthorSelect = (name: string) => {
    const params = new URLSearchParams()
    if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
    params.set('author', name)
    router.push(`/?${params.toString()}`)
  }

  const handleBookClick = (file: GitHubFile) => {
    const params = new URLSearchParams()
    if (repoUrl !== initialRepoUrl) params.set('repo', repoUrl)
    params.set('author', author)
    params.set('name', file.name)
    router.push(`/book?${params.toString()}`)
  }

  return {
    repoUrl,
    author,
    book,
    authors,
    books,
    loading,
    error,
    fileContent,
    currentFile,
    isReaderMode: mode === 'book',
    handleConfirm,
    handleAuthorSelect,
    handleBookClick,
  }
}
