<template>
  <div>
    <AppHeader></AppHeader>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import 'nprogress/nprogress.css'
import AppHeader from "@/components/appHeader.vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {AccountApi, UserInfoApi} from "@/js/Requests"
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
    AccountApi.getUserInfo(token)
        .then(r => {
          store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
          store.commit('setUserProfile', r)
          User.setUserInfoInSession(r)
        })
        .catch(e => {
          Notification.Notify(`连接服务器失败，无法获取用户信息，请重新登录账号。${e}`, {
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
    UserInfoApi.getUserBalance()
        .then(res => {
          store.commit('setUserBalance', res)
        })
        .catch(err => {
          Notification.Notify(`无法获取用户余额，请稍后重试。${err}`, {
            type: 'error',
            title: '出错',
            duration: 3000
          })
        })
    UserInfoApi.getUserCredit()
        .then(res => {
          store.commit('setUserCredits', res)
        })
        .catch(err => {
          Notification.Notify(`无法获取用户积分，请稍后重试。${err}`, {
            type: 'error',
            title: '出错',
            duration: 3000
          })
        })
    UserInfoApi.getUserCoupon()
        .then(res => {
          store.commit('setUserCoupons', res)
        })
        .catch(err => {
          Notification.Notify(`无法获取用户优惠券，请稍后重试。${err}`, {
            type: 'error',
            title: '出错',
            duration: 3000
          })
        })
  }
}
pageInitial()
</script>
