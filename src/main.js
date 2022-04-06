import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import router from './router'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from "pinia"
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(createPinia()).use(router).use(ElementPlus)
app.mount('#app')
