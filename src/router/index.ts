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

export default router
