/**
 * 根据文件大小（字节）预估阅读时长
 * 假设：中文 UTF-8 约 3 字节/字，阅读速度约 400 字/分钟
 */
export function estimateReadingTime(sizeInBytes: number): string {
  const charsEstimated = Math.floor(sizeInBytes / 3)
  const minutes = Math.ceil(charsEstimated / 400)

  if (minutes < 1) return '约 1 分钟'
  if (minutes < 60) return `约 ${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const remainMins = minutes % 60
  if (remainMins === 0) return `约 ${hours} 小时`
  return `约 ${hours} 小时 ${remainMins} 分钟`
}
