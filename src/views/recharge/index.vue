<template>
  <div class="bg-gray-50 pb-32">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="充值消费">
      </div>
    </div>

    <div class="container mx-auto">
      <div class="payment-container w-full overflow-hidden">

        <div class="payment-sidebar h-full z-50">
          <div class="payment-sidebar__inner">
            <div class="about text-center w-full text-black">
              <h1 class="cash-icon text-9xl font-black">¥</h1>
              <span>会员卡余额充值</span>
              <h1 class="text-2xl mt-5">当前余额</h1>
              <h1 :class="[parseFloat(pageData.balance) >= 10000 ? 'text-5xl' : 'text-4xl', 'font-bold']">{{ pageData.balance === 0 ? '加载中' : pageData.balance }}</h1>
              <h1 class="text-2xl mt-2">元</h1>
            </div>
          </div>
        </div>

        <div class="payment-main p-5">
          <el-form :model="rechargeForm" label-width="120px">
            <el-form-item label="充值账号">
              <div>
                <span class="font-bold">{{ pageData.userNickname }}</span>
                <span class="mx-2">-</span>
                <span class="text-gray-400">{{ pageData.userId }}</span>
              </div>
            </el-form-item>
            <el-form-item label="充值金额">
              ¥
              <el-input
                  v-model="rechargeForm.amount"
                  :min="1"
                  :max="500"
                  :step="1"
                  size="large"
                  class="custom-recharge"
                  placeholder="请输入充值金额">
              </el-input>
              元
            </el-form-item>
            <el-form-item>
              <el-divider></el-divider>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-radio-group v-model="rechargeForm.payment">
                <el-radio label="wechat" size="large" border>微信支付</el-radio>
                <el-radio label="alipay" size="large" border>支付宝支付</el-radio>
                <el-radio label="unionpay" size="large" border>银联云闪付</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="请先同意会员卡充值协议"
                  placement="bottom"
                  :visible="!pageData.agreement"
              >
                <el-button
                    class="mr-5"
                    type="primary"
                    size="large"
                    @click="onRechargeSubmit"
                    :loading="pageData.rechargeLoading"
                    :disabled="!pageData.agreement">
                  充值
                </el-button>
              </el-tooltip>
              <el-checkbox v-model="pageData.agreement">
                <span class="text-gray-600">我已阅读并同意</span>
                <a class="text-blue-600">《会员卡充值协议》</a>
              </el-checkbox>

            </el-form-item>

          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_recharge.png'
import {reactive} from "vue"
import {watch} from "vue"
import {useStore} from "vuex"
import Notification from "@/js/Utilities/Notification"
import {UserInfoApi} from "@/js/Requests"

const store = useStore()

let pageData = reactive({
  userNickname: '',
  userId: '',
  balance: '0.0',
  rechargeLoading: false,
  agreement: false,
})

const allowedPayment = ['wechat', 'alipay', 'unionpay']

// const date = new Date()
let rechargeForm = reactive({
  amount: "10",
  payment: "wechat",
})

const FormValidation = () => {
  // 校验支付方式
  if (allowedPayment.indexOf(rechargeForm.payment) === -1) {
    Notification.Notify('请选择支付方式', {type: 'warning'})
    return false
  }

  // 校验充值金额
  if (rechargeForm.amount < 1 || rechargeForm.amount > 1000) {
    Notification.Notify('充值金额必须在1-1000元之间', {type: 'warning'})
    return false
  }

  return true
}

const onRechargeSubmit = () => {
  pageData.rechargeLoading = true
  // 输入框字符串校验
  if (FormValidation()) {
    // 提交表单
    UserInfoApi.postUserRecharge(rechargeForm.amount)
        .then(res => {
          pageData.rechargeLoading = false
          Notification.Notify(res, {type: 'success'})
        })
        .then(() => {
          return UserInfoApi.getUserBalance()
        })
        .then(res => {
          store.commit('setUserBalance', res)
        })
        .catch(err => {
          pageData.rechargeLoading = false
          Notification.Notify(err, {title: '出错了!',type: 'error'})
        })
  } else {
    pageData.rechargeLoading = false
  }
}

watch(() => store.state.userProfile, (newVal) => {
  pageData.userNickname = newVal.name
  pageData.userId = newVal.id
}, {immediate: true, deep: true})

watch(() => store.state.userInfo, (newVal) => {
  pageData.balance = newVal.balance
  if (newVal.balance >= 10000) {
    pageData.balance = (newVal.balance / 10000).toFixed(1) + '万'
  }
}, {immediate: true, deep: true})

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #00ffff 0, #21e0ff 25%, #3cb5f2 50%, #408cbb 75%, #3b6788 100%);
  animation: initiation 1s forwards;
}

.payment-container {
  position: relative;
  width: 990px;
  min-height: fit-content;
  margin: 15px auto;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}

.payment-sidebar {
  float: left;
  margin-right: -1px;
  width: 210px;
  min-height: 350px;
  border-right: 1px solid #e5e5e5;
}

.payment-sidebar__inner {
  margin: 0 25px;
  padding: 30px 0 20px;
  color: #7f7f7f;
  font-size: 12px;
}

.custom-recharge {
  width: 150px;
  margin: 0 5px;
}
</style>
