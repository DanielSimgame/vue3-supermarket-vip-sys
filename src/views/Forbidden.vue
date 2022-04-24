<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-gray-900">403 Forbidden</h1>
    </div>
  </header>
  <div class="w-fit mx-auto my-32">
    <h1 class="text-9xl mb-5">不允许访问</h1>
    <h1 class="text-5xl mb-5">根据服务器设置，您无法访问该页面</h1>
    <h1 class="text-5xl mb-5">请核对链接再访问</h1>

    <el-button
        size="large"
        @click="goBack"
    >
      <el-icon><ArrowLeftBold /></el-icon>
      <span class="ml-5">
        返回上一页
      </span>
    </el-button>

    <el-button
        size="large"
        type="primary"
        @click="goHome"
    >
      <el-icon><HomeFilled /></el-icon>
      <span class="ml-5">
        返回首页
      </span>
    </el-button>

  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
import {HomeFilled, ArrowLeftBold} from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>
