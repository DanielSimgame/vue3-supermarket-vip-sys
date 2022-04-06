import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Home from '@/views/Home.vue'
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]
