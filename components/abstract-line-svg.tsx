'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/**
 * 根据字符串生成简单的哈希种子（用于确定性随机）
 */
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    h = ((h << 5) - h + c) | 0
  }
  return Math.abs(h)
}

/**
 * seeded 随机数 [0, 1)
 */
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * 生成固定音频风曲线风格 SVG，频谱形状由种子随机决定
 */
function generateLineSvg(seedStr: string): string {
  const base = hashStr(seedStr)
  const r = (n: number) => seeded(base + n)

  const hue = 20 + Math.floor(r(0) * 50)
  const color = `hsl(${hue}, 45%, 50%)`
  const opacity = 0.12 + r(1) * 0.1
  const strokeWidth = 0.8 + r(2) * 0.5

  // 固定风格：单条频谱曲线，频谱数值随机
  const pointsPerBand = 25 + Math.floor(r(3) * 15)
  const centerY = 50 + (r(4) - 0.5) * 10
  const amp = 12 + r(5) * 15

  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= pointsPerBand; i++) {
    const t = i / pointsPerBand
    const x = 2 + t * 96
    const randAmp = (r(10 + i) - 0.3) * amp * 1.2
    const wave = Math.sin(t * Math.PI * (2 + r(50 + i) * 3)) * amp * 0.5
    const y = centerY + randAmp + wave
    pts.push({ x, y })
  }

  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`
  }

  const path = `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">${path}</svg>`
}

export interface AbstractLineSvgProps {
  /** 用于生成确定性随机图形的种子字符串 */
  seed: string
  className?: string
  /** 是否作为背景图铺满（默认 true） */
  objectFit?: 'cover' | 'contain' | 'fill'
}

/**
 * 根据传入的字符串生成音频风频谱曲线 SVG 背景（频谱形状随机）
 */
export function AbstractLineSvg({
  seed,
  className,
  objectFit = 'cover',
}: AbstractLineSvgProps) {
  const svg = useMemo(() => generateLineSvg(seed), [seed])

  const backgroundSize =
    objectFit === 'fill' ? '100% 100%' : objectFit

  return (
    <div
      className={cn('absolute inset-0 pointer-events-none opacity-50', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize,
        backgroundPosition: 'center',
      }}
      aria-hidden
    />
  )
}
