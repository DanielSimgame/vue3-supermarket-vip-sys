<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="积分商城">
      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_credits.png'

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ffff3c 0, #e6ff48 10%, #c3ff56 20%, #9dff63 30%, #73ff6e 40%, #3cf278 50%, #00e381 60%, #00d689 70%, #00cb93 80%, #00c29c 90%, #00bba7 100%);
  animation: initiation 1s forwards;
}
</style>
