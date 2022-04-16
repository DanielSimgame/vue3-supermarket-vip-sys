// use store.commit('mutationName') to call the mutation

// 插件需要向Vue全局挂载属性，即Vue.prototype.xx = xx，在vue3中这一写法已经废除，需要用app.config.globalProperties.xx = xx来替换

export default {
  /**
   * @function setUserRole
   * @description set user role
   * @param {Object} state vuex state
   * @param {String} role user role
   */
  setUserRole(state, role) {
    state.userRole = role
  },
  /**
   * @function setUserProfile
   * @description set user info
   * @param {Object} state vuex store state
   * @param {Object} payload user info object
   */
  setUserProfile(state, payload) {
    state.userProfile = payload
    state.isLoggedIn = true
    if (payload.role === 1) {
      state.userRole = 'admin'
    } else if (payload.role === 0) {
      state.userRole = 'user'
    }
  },
  /**
   * @function setUserBalance
   * @description set user balance
   * @param {Object} state vuex store state
   * @param {Number} payload user balance
   * */
  setUserBalance(state, payload) {
    state.userInfo.balance = payload
  },
  /**
   * @function setUserCredits
   * @description set user credits
   * @param {Object} state vuex store state
   * @param {Number} payload user credits
   * */
  setUserCredits(state, payload) {
    state.userInfo.credits = payload
  },
  /**
   * @function setUserCoupons
   * @description set user coupons
   * @param {Object} state vuex store state
   * @param {Number} payload user coupons
   * */
  setUserCoupons(state, payload) {
    state.userInfo.coupons = payload
  },
  /**
   * @function clearUserInfo
   * @description clear user info
   * @param {Object} state vuex store state
   */
  clearUserInfo(state) {
    state.userProfile = {
      id: "",
      name: "",
      email: "",
      detail: "",
      phone: "",
      username: "",
      gender: "",
      role: 0,
      portrait: "",
    }
  },
  /**
   * @function setDefaultUserInfo
   * @description set user info to default values
   * @param {Object} state vuex store state
   */
  setDefaultUserInfo(state) {
    state.userProfile = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    }
  }
}
