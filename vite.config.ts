/*
 * @Author: 王鑫
 * @Description:
 * @Date: 2022-04-01 10:10:14
 */
import { resolve } from 'path'
import { defineConfig } from 'vite'
// mock服务
// import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // viteMockServe({
    //   // ↓解析根目录下的mock文件夹
    //   mockPath: "mock",
    //   supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
    //   watchFiles: true, // 监视文件更改
    // }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/svg-icons')],
      // 指定symbolId格式
      symbolId: 'icon-[name]'
    })
  ],

  // css配置
  css: {
    preprocessorOptions: {
      scss: {
        // 导入全局变量
        additionalData: `@import "@/styles/variables.scss";\n`
      }
    }
  },

  base: './',

  resolve: {
    // 别名配置
    alias: {
      '@': resolve(__dirname, 'src/')
    }
  },

  // 跨域
  server: {
    // port: 3000,
    // base: "./ ", //生产环境路径
    proxy: {
      '/admin': {
        target: 'http://124.221.224.247:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/product': {
        target: 'http://124.221.224.247:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/student': {
        target: 'http://124.221.224.247:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/order': {
        target: 'http://124.221.224.247:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/placeOrder': {
        target: 'http://124.221.224.247:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
