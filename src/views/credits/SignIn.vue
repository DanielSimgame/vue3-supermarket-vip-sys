<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="每日签到">
      </div>
    </div>

    <div class="container mx-auto">
      <div class="w-full h-64 flex flex-col justify-center items-center">
        <h1 class="text-2xl font-black">{{ pageData.today }}</h1>
        <h1 class="text-6xl font-black">{{ pageData.myCredit }}</h1>
        <h1 class="text-2xl">当前积分</h1>
        <el-button type="primary" class="mt-4" size="large" @click="onSignInClick">签到</el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_signin.png'
import {UserInfoApi} from "@/js/Requests"
import {reactive, watch} from "vue"
import {useStore} from "vuex"
import Notification from "@/js/Utilities/Notification"

const store = useStore()
const date = new Date()

let pageData = reactive({
  myCredit: 0,
  today: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
})

const onSignInClick = () => {
  UserInfoApi.getUserSignIn()
      .then(res => {
        if (res.search('签到成功') === 0) {
          store.commit('addUserCredits')
          Notification.Notify('获得10积分',{
            title: res,
            type: 'success'
          })
        } else {
          Notification.Notify(res,{
            title: '出错了',
            type: 'error'
          })
        }
      })
      .catch(err => {
        Notification.Notify(err,{
          title: '出错了',
          type: 'error'
        })
      })
}

watch(() => store.state.userInfo, (newVal) => {
  pageData.myCredit = newVal.credits
},{ immediate: true, deep: true })
</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ff56ff 0, #c14bff 25%, #783cf2 50%, #1b2cc7 75%, #001fa0 100%);
  /*background-image: radial-gradient(circle at 50% -3.03%, #a8b0ff 0, #788fff 25%, #486ee5 50%, #104eae 75%, #00317b 100%);*/
  animation: initiation 1s forwards;
}
</style>
