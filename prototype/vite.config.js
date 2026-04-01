import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.dev', // 允许所有ngrok域名
      'unacclaimed-consentedly-neymar.ngrok-free.dev' // 你的具体域名
    ],
    cors: true, // 启用CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  }
})