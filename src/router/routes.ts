export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../views/IndexPage.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/HomePage.vue'),
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
    path: '/edit/:id',
    name: 'edit',
    component: () => import('@/views/edit/EditPage.vue'),
    meta: {
      title: '编辑页'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/UserLogin.vue'),
    meta: {
      title: '登录'
    }
  }
]
