<template>
  <div>
    <AppHeader></AppHeader>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import 'nprogress/nprogress.css'
import AppHeader from "@/components/appHeader.vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {UsersApi} from "@/js/Requests";
import User from "@/js/Utilities/UserStorages"
import Notification from "@/js/Utilities/Notification"

const store = useStore()
const router = useRouter()

/**
 * @function pageInitial
 * @description 初始化页面
 */
const pageInitial = async () => {
  // console.log("pageInitial")
  const token = User.getToken()
  if (token) {
    // 如有token则先让用户以user权限访问，再向后端请求权限
    store.commit('setUserRole', 'user')
    UsersApi.getUserInfo(token)
        .then(r => {
          store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
          store.commit('setUserInfo', r)
          User.setUserInfoInSession(r)
        })
        .catch(e => {
          Notification.Notify('连接服务器失败，无法获取用户信息，请重新登录账号。', {
            type: 'error',
            title: '出错',
            duration: 3000
          })
          store.commit("clearUserInfo");
          User.delToken();
          User.delUserInfoInSession();
          router.push("/login");
          window.location.reload();
        })
  }
}
pageInitial()
</script>
