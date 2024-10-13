import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const token = localStorage.getItem('access_token')
    if (token) {
      next()
      document.title = `code-editor-${to.meta.title || ''}`
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

export default router
