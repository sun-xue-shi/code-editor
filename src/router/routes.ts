export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../views/IndexPage.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'template:id',
        name: 'template',
        component: () => import('@/views/TemplateDetail.vue'),
        meta: {
          title: '模版页'
        }
      }
    ]
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('@/views/EditPage.vue'),
    meta: {
      title: '编辑页'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/UserLogin.vue'),
    meta: {
      title: '登录'
    }
  }
]
