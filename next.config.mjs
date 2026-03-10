/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: '.next', // Reverted to default
  // output: 'export', // Disabled to allow Server Actions
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 静态导出配置
  trailingSlash: true,
}

export default nextConfig
