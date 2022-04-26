import {createStore} from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  state: {
    app: {
      title: import.meta.env.VITE_APP_TITLE || '超市会员系统',
      apiUrl: import.meta.env.VITE_API_URL || 'https://cs.api.keker.icu',
      dialogVisibility: {
        notification: false,
      },
      navigation: [
        { name: '首页', path: '/', routerName: 'home', needLogin: false },
        { name: '消费', path: '/credits', routerName: 'credits', needLogin: true },
        { name: '余额充值', path: '/recharge', routerName: 'recharge', needLogin: true },
        { name: '积分兑换', path: '/exchange', routerName: 'exchange', needLogin: true },
        { name: '每日签到', path: '/signin', routerName: 'signin', needLogin: true },
      ]
    },
    userRole: '',
    userProfile: {
      id: "",
      name: "",
      email: "",
      detail: "",
      phone: "",
      username: "",
      gender: "",
      role: -1,
      portrait: "",
    },
    userInfo: {
      coupons: [],
      credits: 0,
      balance: 0,
    },
    userBills: [],
    isLoggedIn: false
  },
  getters,
  mutations,
  actions,
  modules: {}
})

