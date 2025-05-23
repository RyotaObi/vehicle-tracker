/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的HTMLとしてエクスポート
  images: {
    unoptimized: true,  // 画像最適化を無効化
  },
  // Leafletのためのwebpack設定
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // ビルド時の警告を無視（必要に応じて）
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig