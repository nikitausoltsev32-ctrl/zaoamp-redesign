/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // 28.09.2026: B2B-спрос на ЛКМ ≈ 0, страница циклично LOW_QUALITY в Яндексе — ЛКМ описаны в категории муки
      { source: '/primenenie/lkm/', destination: '/catalog/muka/', statusCode: 301 },
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

module.exports = nextConfig
