import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import nprogress from "nprogress"
import store from "@/js/store"

import Home from '@/views/Home.vue'
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')

// 用户相关
const Login = () => import('@/views/user/Login.vue')
const SignUp = () => import('@/views/user/SignUp.vue')

nprogress.configure({ showSpinner: false })

// const whiteList = ['/login', '/auth-redirect']
const whiteList = ['/login', '/signup', '/404', '/403'] // 未登录不重定向白名单
const redirectList = ['/login', '/signup'] // 已登录重定向名单

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      roles: ["admin", "user"]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: '关于',
      roles: ["admin"]
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
    }
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      title: "注册",
    }
  },
  // {
  //   path: '*',
  //   name: 'not-found',
  //   component: NotFound
  // },
  { path: '/:path(.*)', component: NotFound, meta: { title: '404' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * @function titleHandler
 * @description 路由与网页标题处理
 * @param {any} to 路由对象
 * */
const titleHandler = (to: any) => {
  if (to.meta.title) {
      document.title = `${to.meta.title} - ${store.state.app.title}`
  } else {
    document.title = `${store.state.app.title}`  //没有就默认
  }
}

// router guards
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  // // 检查用户角色
  // const token = User.getToken()
  // const requiredRoles: any = to.meta.roles
  // const currentRole = store.getters.getUserRole
  // if (currentRole === '' && whiteList.indexOf(to.path) === -1) {
  //   // 用户未登录，且页面不在 不重定向白名单 中，重定向到登录页
  //   titleHandler(to)
  //   next('/login')
  // } else if (to.matched.length === 0) {
  //   // 用户已登录，路由不存在无法跳转，重定向到404页面
  //   titleHandler(to)
  //   next('/404')
  // } else if ((currentRole === 'admin' || 'user') && requiredRoles && requiredRoles.indexOf(currentRole) === -1) {
  //   // 用户已登录，路由存在但无权限无法跳转，向后端请求查询用户身份再进行判断
  //   if (!token) {
  //     titleHandler(to)
  //     next('/login')
  //   } else {
  //     await RequestUtil.getUserInfo(token)
  //         .then(res => {
  //           if (res.role === 1) {
  //             titleHandler(to)
  //             next()
  //           } else {
  //             titleHandler(to)
  //             next('/403')
  //           }
  //         }).catch(err => {
  //           titleHandler(to)
  //           next('/403')
  //         })
  //   }
  // } else if (currentRole !== '' && redirectList.indexOf(to.path) !== -1) {
  //   // 用户已登录，不允许访问登录页和注册页
  //   titleHandler(to)
  //   next('/')
  // } else {
    // 用户已登录，正常访问网页
    titleHandler(to)
    next()
  // }
})

router.afterEach(() => {
  nprogress.done()
})

export default router;
