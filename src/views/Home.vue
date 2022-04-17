<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="充值消费">
      </div>
    </div>
    <div
      class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="container">
        <div class="user-overview relative">
          <div class="user-profile block float-left flex flex-col shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all justify-center">
            <div class="user-icon rounded-full shadow-lg mx-auto overflow-hidden border-white h-24 w-24">
              <img
                  v-if="pageData.isLoggedIn"
                  :src="userProfile.portrait"
                  alt="User Icon"
              />
              <svg v-else class="animate-spin h-full w-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div class="user-name flex w-fit mx-auto mt-3">
              <h1 class="text-2xl text-center font-bold">
                {{ userProfile.name || '信息加载中' }}
              </h1>
              <h2 class="bg-white text-black rounded-lg py-1 px-3 mx-2" v-if="pageData.isLoggedIn">
                {{ userProfile.role === 1 ? '管理员' : '会员' }}
              </h2>
            </div>
          </div>

          <div class="user-information block bg-white p-5 top-0.5 translate-y-1">
            <div class="px-6 h-12 border-b">我的钱包</div>
            <div class="px-6">
              <ul class="flex justify-around overflow-hidden">
                <li>
                  <div class="my-10 text-5xl font-bold">
                    {{ pageData.isLoggedIn ? userInfo.coupons.length : '加载中' }}
                  </div>
                  <span>优惠券</span>
                </li>
                <li>
                  <div class="my-10 text-5xl font-bold">
                    {{ pageData.isLoggedIn ? userInfo.credits : '加载中' }}
                  </div>
                  <span>积分</span>
                </li>
                <li>
                  <div class="my-10 text-5xl font-bold">
                    ¥ {{ pageData.isLoggedIn ? userInfo.balance : '加载中' }}
                  </div>
                  <span>余额</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_homepage.png'
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {reactive, watch} from "vue"

const store = useStore()
const router = useRouter()

let pageData = reactive({
  isLoggedIn: false,
})

let userProfile = reactive({
  name: "",
  email: "",
  detail: "",
  phone: "",
  username: "",
  role: -1,
  gender: "",
  portrait: "http://www.fzlkz.com/uploads/allimg/c150826/1440602K92G50-11158.jpg",
  id: ""
})

let userInfo = reactive({
  balance: 0,
  credits: 0,
  coupons: []
})

watch(() => store.state.isLoggedIn, (newVal) => {
  pageData.isLoggedIn = newVal
}, {immediate: true, deep: true})

watch(() => store.state.userProfile, (newVal) => {
  userProfile.name = newVal.name
  userProfile.role = newVal.role
  userProfile.portrait = newVal.portrait
}, {immediate: true, deep: true})

watch(() => store.state.userInfo, (newVal) => {
  userInfo.balance = newVal.balance
  userInfo.credits = newVal.credits
  userInfo.coupons = newVal.coupons
}, {immediate: true, deep: true})

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ffff55 0, #fff64d 12.5%, #ffe246 25%, #ffcc41 37.5%, #f2b53c 50%, #e39f38 62.5%, #d48c36 75%, #c77b34 87.5%, #bb6c33 100%);
  /*background-image: radial-gradient(circle at 50% -20.71%, #e6f58f 0, #e9eb7f 10%, #ecdf6e 20%, #efd25d 30%, #f1c44d 40%, #f2b53c 50%, #f3a52d 60%, #f59522 70%, #f8851d 80%, #fa741e 90%, #fc6324 100%);*/
  animation: initiation 1s forwards;
}

.user-overview {
  height: 250px;
}

.user-profile {
  width: 250px;
  height: 250px;
  background-color: #f4ca3a;
  background-image: linear-gradient(147deg, #f4ca3a 0%, #ffa300 74%);
}

.user-icon {
  border-width: 6px;
}

.user-information {
  margin: auto 0 auto 250px;
  height: 240px;
  /*margin: 9px 0 9px 250px;*/
}

</style>
