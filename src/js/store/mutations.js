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
   * @function setUserInfo
   * @description set user info
   * @param {Object} state vuex store state
   * @param {Object} payload user info object
   */
  setUserInfo(state, payload) {
    state.userInfo = payload
    state.isLoggedIn = true
    if (payload.role === 1) {
      state.userRole = 'admin'
    } else if (payload.role === 0) {
      state.userRole = 'user'
    }
  },
  /**
   * @function clearUserInfo
   * @description clear user info
   * @param {Object} state vuex store state
   */
  clearUserInfo(state) {
    state.userInfo = {
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
    state.userInfo = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    }
  }
}
