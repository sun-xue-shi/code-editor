export const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    component: () => import('@/views/IndexPage.vue'),
    meta: {
      requireAuth: true,
      title: '首页'
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          requireAuth: true,
          title: '首页'
        },
      },
      {
        path: 'template:id',
        name: 'template',
        component: () => import('@/views/TemplateDetail.vue'),
        meta: {
          requireAuth: true,
          title: '模版页'
        }
      }
    ]
  },

  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import('@/views/EditPage.vue'),
    meta: {
      requireAuth: true,
      title: '编辑页'
    }
  }
]
