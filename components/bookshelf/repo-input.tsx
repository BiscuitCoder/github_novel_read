'use client'

import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RepoInputProps {
  repoUrl: string
  onConfirm: (url: string) => void
}

export function RepoInput({ repoUrl, onConfirm }: RepoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleConfirm = () => {
    const url = inputRef.current?.value?.trim() || ''
    onConfirm(url)
  }

  return (
    <div className="flex gap-2 rounded-xl">
      <Input
        ref={inputRef}
        defaultValue={repoUrl}
        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        placeholder="输入 GitHub 仓库地址 (含 txt 文件)"
        className="flex-1 min-w-0"
      />
      <Button onClick={handleConfirm}>加载</Button>
    </div>
  )
}
