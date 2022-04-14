<template>
  <div class="bg-gray-50">
    <div
        class="login-bg my-0 px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="login-wrap overflow-hidden absolute md:right-0.5 lg:right-0  shadow-xl top-30 h-80 bg-white p-6">
        <div class="login-content w-fit ml-10">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="账号密码登录" name="account"></el-tab-pane>
          </el-tabs>
          <el-form v-model="loginForm.value" label-width="60px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  @keyup.enter="onLoginClick"
                  type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="login-submit flex-row justify-between min-w-full">
                <el-tooltip
                    class="tooltips-item"
                    effect="dark"
                    content="请先同意《用户协议》与《个人隐私条例》"
                    placement="bottom"
                    :visible="!isEulaAgreed"
                >
                  <el-button
                      type="primary"
                      size="large"
                      class="w-44"
                      @click="onLoginClick"
                      :disabled="!isEulaAgreed"
                      :loading="btnLoading"
                  >登录
                  </el-button>
                </el-tooltip>
                <el-button size="large" class="w-20" @click="onSignupClick">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="mt-12">
            <el-checkbox v-model="isEulaAgreed">
              我已阅读并同意
              <el-button
                  class="login__btn-eula"
                  size="small"
                  type="text"
                  @click="onEulaClick"
              >《用户协议》
              </el-button>
              与
              <el-button
                  class="login__btn-privacy"
                  size="small"
                  type="text"
                  style="margin-left: 0"
                  @click="onPrivacyClick"
              >《个人隐私协议》
              </el-button>
              。
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--    <div class="footer-container">-->
  <!--      -->
  <!--    </div>-->
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {UsersApi} from "@/js/Requests"
import Notification from "@/js/Utilities/Notification"
import User from "@/js/Utilities/UserStorages"

const router = useRouter()
const store = useStore()

const activeTab = ref('account')

let btnLoading = ref(false)
let isEulaAgreed = ref(true)
let loginForm = reactive({
  username: '',
  password: '',
})

/**
 * @function isValid
 * @description 校验表单是否合法
 * */
const isValid = () => {
  if (isEulaAgreed.value === false) {
    return false
  }
  return loginForm.username.length > 0 && loginForm.password.length > 0
}

/**
 * @function onLoginClick
 * @description 登录按钮点击事件
 * */
const onLoginClick = () => {
  if (isValid()) {
    btnLoading.value = true
    UsersApi.postLogin(loginForm)
        .then((r = {isLogin: false, isAdmin: false, token: ''}) => {
          btnLoading.value = false
          if (r.isLogin) {
            User.setToken(r.token)
            if (r.isAdmin) {
              User.setRole('admin')
            } else {
              User.setRole('user')
            }
            return r.token
          } else {
            throw new Error('请检查您的账号密码是否正确')
          }
        })
        .then(token => {
          if (token) {
            return UsersApi.getUserInfo(token)
          }
        })
        .then(r => {
          store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
          store.commit('setUserInfo', r)
          return router.push('/')
        })
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
          btnLoading.value = false
          Notification.Notify(`登录失败！${err.message}`, {title: '错误', type: 'error'})
        })
  } else {
    Notification.Notify('请检查您的账号密码是否正确', {
      title: '登录失败',
      type: 'error',
    })
  }
}

/**
 * @function onSignupClick
 * @description 注册按钮点击事件
 */
const onSignupClick = () => {
  router.push('/signup')
}

/**
 * @function onEulaClick
 * @description 用户协议按钮点击事件
 * */
const onEulaClick = () => {
  router.push('/user/eula')
}

/**
 * @function onPrivacyClick
 * @description 隐私政策按钮点击事件
 * */
const onPrivacyClick = () => {
  router.push('/user/privacy')
}

</script>

<style scoped>
.login-bg {
  height: 600px;
  background-image: url("@/assets/images/bg_login.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-wrap {
  min-width: 450px;
  width: 35%;
  /*animation: slideInRight-enter 0.5s ease-out;*/
}

.login-content {
  animation: slideInRight-enter 0.5s ease-in-out;
}

.login-submit {
  display: flex !important;
  flex-direction: row;
}

@keyframes slideInRight-enter {
  0% {
    opacity: 0;
    transform: translateX(200%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
