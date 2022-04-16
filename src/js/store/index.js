import {createStore} from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  state: {
    app: {
      title: import.meta.env.VITE_APP_TITLE || '超市会员系统',
      apiUrl: import.meta.env.VITE_API_URL || 'https://cs.api.keker.tech',
      navigation: [
        { name: '首页', path: '/', routerName: 'home', needLogin: false },
        { name: '积分商城', path: '/credit', routerName: 'credit', needLogin: true },
        { name: '充值消费', path: '/charge', routerName: 'charge', needLogin: true },
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
      coupons: 0,
      credits: 0,
      balance: 0,
    },
    isLoggedIn: false
  },
  getters,
  mutations,
  actions,
  modules: {}
})

