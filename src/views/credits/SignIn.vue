<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="每日签到">
      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_signin.png'

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ff56ff 0, #c14bff 25%, #783cf2 50%, #1b2cc7 75%, #001fa0 100%);
  /*background-image: radial-gradient(circle at 50% -3.03%, #a8b0ff 0, #788fff 25%, #486ee5 50%, #104eae 75%, #00317b 100%);*/
  animation: initiation 1s forwards;
}
</style>
