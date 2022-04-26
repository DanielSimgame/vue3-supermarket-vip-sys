<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="积分兑换">
      </div>
    </div>
  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_credits.png'
import {UserInfoApi} from "@/js/Requests"
import {onMounted, reactive, watch} from "vue"
import {useStore} from "vuex"
import Notification from "@/js/Utilities/Notification"

const store = useStore()

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  animation: initiation 1s forwards;
  background-image: radial-gradient(circle at 50% -20.71%, #a3a7ff 0, #7a8ffc 25%, #3c78f2 50%, #0063e8 75%, #0051de 100%);
}
</style>
