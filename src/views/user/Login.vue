<template>
  <div class="bg-gray-50">
    <div
        class="login-bg my-0 px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="lg:container h-80 relative">
        <div class="login-container absolute right-2 top-30 w-96 h-80 bg-white p-6">
          <el-tabs>
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
                    :visible="loginBtnDisabled"
                >
                  <el-button
                      type="primary"
                      size="large"
                      class="w-44"
                      @click="onLoginClick"
                      :disabled="loginBtnDisabled"
                      :loading="btnLoading"
                  >登录
                  </el-button>
                </el-tooltip>
                <el-button size="large" class="w-20" @click="onSignupClick">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="mt-12">
            <el-checkbox v-model="isEulaAgreed" @change="onEulaChange">
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
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {postLogin, getUserInfo} from "@/js/Utilities/Requests"
import Notification from "@/js/Utilities/Notification"
import User from "@/js/Utilities/User"

const router = useRouter()
const store = useStore()

let btnLoading = ref(false)
let isEulaAgreed = ref(true)
let loginBtnDisabled = ref(false)
let eulaAgreed = ref(false)
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
const onLoginClick = async () => {
  if (isValid()) {
    btnLoading.value = true
    await postLogin(loginForm)
        .then(r => {
          btnLoading.value = false
          if (r.isLogin) {
            User.setToken(r.token)
            if (r.isAdmin) {
              User.setRole('admin')
            } else {
              User.setRole('user')
            }
            getUserInfo(r.token)
                .then(r => {
                  store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
                  store.commit('setUserInfo', r)
                  goHome()
                })
          } else {
            Notification.Notify('请检查您的账号密码', {
              title: '登录失败',
              type: msgType.ERROR,
            })
          }
        })
        .catch(err => {
          console.log(err)
          btnLoading.value = false
          Notification.Notify('登录失败！', {title: '错误', type: 'error'})
        })
  } else {
    Notification.Notify('请检查您的账号密码', {
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
  router.push('/user/signup')
}

/**
 * @function onEulaChange
 * @description 同意用户协议按钮点击事件
 * */
const onEulaChange = () => {
  loginBtnDisabled.value = !eulaAgreed.value
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

.login-slogan-text {
  font-weight: bold;
  font-style: italic;
}

.login-submit {
  display: flex !important;
  flex-direction: row;
}
</style>
