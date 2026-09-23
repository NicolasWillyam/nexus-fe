import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Đây là "trạm gác": khi giao diện (chạy ở cổng 5173) gọi tới
// "/api/...", Vite sẽ tự động chuyển tiếp (proxy) request đó
// sang backend FastAPI đang chạy ở 127.0.0.1:8000.
// Nhờ vậy trình duyệt không báo lỗi CORS.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
