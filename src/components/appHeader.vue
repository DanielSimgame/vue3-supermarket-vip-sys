<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">打开导航栏</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/">
              <img class="block lg:hidden h-8 w-auto"
                   src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow"/>
              <div class="hidden lg:flex h-8 w-auto">
                <img class="h-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow"/>
                <h1 class="logo-text text-white mx-5 my-auto text-xl font-bold">超市会员系统</h1>
              </div>
            </router-link>
          </div>

          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4" v-if="pageData.isLoggedIn">
              <router-link
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.path"
                  :class="[$router.currentRoute.value.name === item.routerName ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']"
                  :aria-current="$router.currentRoute.value.name === item.routerName ? 'page' : undefined">
                {{ item.name }}
              </router-link>
            </div>
          </div>

        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <el-badge
              v-if="pageData.isLoggedIn"
              :value="pageData.notificationCount"
              :max="10"
              :hidden="pageData.notificationCount === 0"
              class="item mr-5"
              type="primary">
            <button
                v-if="pageData.isLoggedIn"
                type="button"
                class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">查看通知</span>
              <BellIcon class="h-6 w-6" aria-hidden="true"/>
            </button>
          </el-badge>

          <!-- 个人资料下拉菜单 -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton
                  v-if="pageData.isLoggedIn"
                  class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span class="sr-only">用户菜单</span>
                <!--                <el-avatar class="h-8 w-8" shape="circle" :src="userInfo.portrait" />-->
                <img class="h-8 w-8 rounded-full" :src="userProfile.portrait" alt=""/>
              </MenuButton>
              <div v-else class="guest">
                <router-link to="/login">
                  <el-button type="primary" round>
                    <el-icon class="mr-2"><userFilled /></el-icon>登录
                  </el-button>
                </router-link>
              </div>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                  class="origin-top-right z-40 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <span :class="['block px-4 py-2 text-sm text-gray-700']">{{ userProfile.name }}</span>
                </MenuItem>
                <MenuItem v-slot="{ active }" v-if="userProfile.role === 1">
                  <a href="#" :class="[active ? 'bg-gray-100' : '', 'cursor-pointer block px-4 py-2 text-sm text-gray-700']">后台管理</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="#" :class="[active ? 'bg-gray-100' : '', 'cursor-pointer block px-4 py-2 text-sm text-gray-700']">个人设置</a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a @click="onLogoutClick"
                     :class="[active ? 'bg-gray-100' : '', 'cursor-pointer block px-4 py-2 text-sm text-gray-700']">退出登录</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>

        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
                          :class="[$router.currentRoute.value.name === item.routerName ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'cursor-pointer block px-3 py-2 rounded-md text-base font-medium']"
                          :aria-current="$router.currentRoute.value.name === item.routerName ? 'page' : undefined">{{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import {reactive, watch} from "vue"
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {BellIcon, MenuIcon, XIcon} from '@heroicons/vue/outline'
import {UserFilled} from '@element-plus/icons-vue'
import {useStore} from "vuex"
import {useRouter, useRoute} from "vue-router"
import Notification from "@/js/Utilities/Notification"
import User from "@/js/Utilities/UserStorages"

const store = useStore()
const router = useRouter()

const navigation = store.state.app.navigation

let pageData = reactive({
  isLoggedIn: false,
  notificationCount: 0,
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

watch(() => store.state.isLoggedIn, (newVal) => {
  pageData.isLoggedIn = newVal
}, {immediate: true, deep: true})

watch(() => store.state.userProfile, (newVal) => {
  userProfile.name = newVal.name;
  userProfile.role = newVal.role;
  userProfile.portrait = newVal.portrait;
}, {immediate: true, deep: true});
/**
 * @function handleLogout
 * @description 处理退出登录
 * */
const handleLogout = () => {
  store.commit("clearUserInfo")
  store.commit('isLoggedIn', false)
  User.delToken()
  User.delUserInfoInSession()
}

/**
 * @function onLogoutClick
 * @description 点击退出登录
 */
const onLogoutClick = () => {
  try {
    handleLogout()
    Notification.Notify("退出登录成功", {type: "success", title: "退出登录"})
  } catch (e) {
    Notification.error(e.message)
  }
  router.push("/login")
  window.location.reload()
}
</script>

<style scoped>
.user__container {
  width: 250px;
}

.logo-text {
  letter-spacing: 1px;
  font-style: italic;
}
</style>
