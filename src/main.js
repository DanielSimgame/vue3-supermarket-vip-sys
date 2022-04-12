import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import router from './js/router'
import store from './js/store'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(store).use(router).use(ElementPlus)
app.mount('#app')
