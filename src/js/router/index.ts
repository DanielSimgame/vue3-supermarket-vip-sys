import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import nprogress from "nprogress"
import store from "@/js/store"
import User from "@/js/Utilities/UserStorages"
import {AccountApi} from "@/js/Requests"

import Home from '@/views/Home.vue'

const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Forbidden = () => import('@/views/Forbidden.vue')

// 用户相关
const Login = () => import('@/views/user/Login.vue')
const SignUp = () => import('@/views/user/SignUp.vue')
const MyProfile = () => import('@/views/user/MyProfile.vue')

// 积分相关
const Credits = () => import('@/views/credits/Bill.vue')
const SignIn = () => import('@/views/credits/SignIn.vue')
const Exchange = () => import('@/views/credits/Exchange.vue')

// 充值相关
const Recharge = () => import('@/views/recharge/index.vue')

// 后台相关
const Admin = () => import('@/views/admin/index.vue')

nprogress.configure({showSpinner: false})

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
        path: '/credits',
        name: 'credits',
        component: Credits,
        meta: {
            title: '消费',
            roles: ["admin", "user"]
        }
    },
    {
        path: '/signin',
        name: 'signin',
        component: SignIn,
        meta: {
            title: '每日签到',
            roles: ["user"]
        }
    },
    {
        path: '/exchange',
        name: 'exchange',
        component: Exchange,
        meta: {
            title: '积分兑换',
            roles: ["admin", "user"]
        }
    },
    {
        path: '/recharge',
        name: 'recharge',
        component: Recharge,
        meta: {
            title: '余额充值',
            roles: ["admin", "user"]
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: {
            title: '后台管理',
            roles: ["admin"]
        }
    },
    {
        path: '/my-profile',
        name: 'MyProfile',
        component: MyProfile,
        meta: {
            title: '个人信息',
            roles: ["admin", "user"]
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
    {
        path: "/403",
        name: "Forbidden",
        component: Forbidden,
        meta: {
            title: "403 无权访问",
        }
    },
    // {
    //   path: '*',
    //   name: 'not-found',
    //   component: NotFound
    // },
    {path: '/:path(.*)', component: NotFound, meta: {title: '404'}}
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
    // 检查用户角色
    const token = User.getToken()
    const requiredRoles: any = to.meta.roles
    let currentRole = store.getters.getUserRole

    // 后端未开放时直接next不做鉴权，便于开发。
    // next()

    // 后端正常运作时需要进行鉴权。
    if (currentRole === '' && whiteList.indexOf(to.path) === -1) {
        // 用户未登录，且页面不在 不重定向白名单 中，重定向到登录页
        console.log('用户未登录，且页面不在 不重定向白名单 中，重定向到登录页')
        titleHandler(to)
        next('/login')
    } else if (to.matched.length === 0) {
        // 用户已登录，路由不存在无法跳转，重定向到404页面
        titleHandler(to)
        next('/404')
    } else if ((currentRole === 'admin' || 'user') && requiredRoles && requiredRoles.indexOf(currentRole) === -1) {
        // 用户已登录，路由存在但无权限无法跳转，向后端请求查询用户身份再进行判断
        if (!token) {
            console.log('!token 用户已登录，路由存在但无权限无法跳转，向后端请求查询用户身份再进行判断')
            titleHandler(to)
            next('/login')
        } else {
            await AccountApi.getUserInfo(token)
                .then(res => {
                    res.role === 1 ? currentRole = 'admin' : currentRole = 'user'
                    if (requiredRoles.indexOf(currentRole) !== -1) {
                        titleHandler(to)
                        next()
                    } else {
                        titleHandler(to)
                        next('/403')
                    }
                })
                .catch(err => {
                    console.log('router err', err)
                    titleHandler(to)
                    next('/403')
                })
        }
    } else if (currentRole !== '' && redirectList.indexOf(to.path) !== -1) {
        // 用户已登录，不允许访问登录页和注册页
        titleHandler(to)
        next('/')
    } else {
        // 用户已登录，正常访问网页
        titleHandler(to)
        next()
    }

})


router.afterEach(() => {
    nprogress.done()
})

export default router
