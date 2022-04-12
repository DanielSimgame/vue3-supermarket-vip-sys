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
</script>
