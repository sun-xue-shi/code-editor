import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { message } from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('accessToken')
//   if (!token) {
//     next({
//       path: '/login',
//       query: { redirect: to.fullPath }
//     })
//   } else {
//     document.title = `code-editor-${to.meta.title || ''}`
//     next()
//   }
// })

router.beforeEach(async (to, from) => {
  document.title = `code-editor-${to.meta.title || ''}`
  const token = localStorage.getItem('accessToken')
  if (!token && to.name !== 'login') {
    message.error('登录已过期')
    return { name: 'login' }
  }
})

export default router
