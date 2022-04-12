import {createStore} from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  state: {
    app: {
      title: import.meta.env.VITE_APP_TITLE || '超市会员系统',
      apiUrl: import.meta.env.VITE_API_URL || 'https://hzf.api.keker.icu',
      navigation: [
        { name: '首页', href: '#', current: true },
        { name: '积分商城', href: '#', current: false },
        { name: '充值消费', href: '#', current: false },
        { name: '每日签到', href: '#', current: false },
      ]
    },
    userRole: '',
    userInfo: {
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
  },
  getters,
  mutations,
  actions,
  modules: {}
})

