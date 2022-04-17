<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="充值消费">
      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_recharge.png'

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #00ffff 0, #21e0ff 25%, #3cb5f2 50%, #408cbb 75%, #3b6788 100%);
  animation: initiation 1s forwards;
}
</style>
