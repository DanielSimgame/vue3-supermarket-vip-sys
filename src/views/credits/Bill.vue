<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="每日签到">
      </div>
    </div>

    <div class="container mx-auto p-5 grid grid-cols-2 gap-10">

      <div class="create-bill col-span-1">
        <h1 class="text-center text-2xl my-5">创建消费账单</h1>
        <el-form v-model="pageData.billForm" :label-width="120">
          <el-form-item label="账单名称">
            <el-input
                v-model="pageData.billForm.description"
                placeholder="请输入账单名称"
                maxlength="50"
                show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="应付金额">
            <el-input
                v-model="pageData.billForm.totalAmount"
                @change="calcNewCost"
                placeholder="请输入账单金额"
                :min="1"
                :max="10000"
            ></el-input>
          </el-form-item>

<!--          <el-form-item label="积分抵扣">-->
<!--            <el-tooltip-->
<!--                class="box-item"-->
<!--                effect="dark"-->
<!--                :content="pageData.creditsDisabledTooltip"-->
<!--                placement="right"-->
<!--                :visible="!pageData.creditsAvailable"-->
<!--            >-->
<!--              <el-checkbox-->
<!--                  v-model="pageData.useCredits"-->
<!--                  class="text-md"-->
<!--                  :disabled="!pageData.creditsAvailable"-->
<!--              >-->
<!--                使用-->
<!--                <span class="font-bold">{{ pageData.productCreditsLimit }}</span>-->
<!--                积分抵扣-->
<!--                <span class="font-bold text-red-500">10</span>-->
<!--                元-->
<!--              </el-checkbox>-->
<!--            </el-tooltip>-->
<!--          </el-form-item>-->

          <el-form-item label="用券抵扣">
            <el-select
                v-model="pageData.selectedCoupon"
                @change="useCoupon()"
                placeholder="选择优惠券"
                :disabled="pageData.isCouponRequesting"
            >
              <el-option
                  :label="pageData.noCouponTip"
                  value=""
              >
                <span class="text-md">不使用优惠券:</span>
                <span class="text-sm text-gray-500">无优惠</span>
              </el-option>
              <el-option
                  v-for="item in pageData.userInfo.currentCoupons"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              >
                <span class="text-md">{{ item.name }}</span>
                <span>:</span>
                <span class="text-sm text-gray-500">{{ item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实付金额">
            <h1 class="text-2xl text-red-500">
              ¥
              <span class="font-bold">{{ pageData.estimatedCost }}</span>
              元
            </h1>
          </el-form-item>
        </el-form>
        <div class="text-center">
          <el-button
              class="mx-auto"
              type="primary"
              size="large"
              @click="doCreateBill"
              :loading="pageData.isBillRequesting"
              :disabled="pageData.isBillRequesting"
          >
            创建账单
          </el-button>
        </div>
      </div>

      <div class="history-bills col-span-1">
        <h1 class="text-center text-2xl my-5">历史消费账单</h1>
        <div>
          <el-table
              :data="pageData.myHistoryBills"
              show-summary
              stripe
              style="width: 100%"
              max-height="320"
              sum-text="合计金额(¥)"
              empty-text="无账单数据"
          >
            <el-table-column prop="description" label="账单描述" fixed="left" width="180"/>
            <el-table-column prop="createDate" label="创建日期" width="180"/>
            <el-table-column prop="discountAmount" sortable label="用券折扣(¥)"/>
            <el-table-column prop="totalAmount" sortable label="实付金额(¥)"/>
          </el-table>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_consume.png'
import {PurchaseApi} from "@/js/Requests"
import Notification from "@/js/Utilities/Notification"
import {reactive, watch} from "vue"
import {useStore} from "vuex"

const store = useStore()

// estimated cost for display, billForm.totalAmount for submit, and billForm.totalAmount does not change
let pageData = reactive({
  // productCreditsLimit: '100',
  // creditsAvailable: false,
  // creditsDisabledTooltip: '您的积分不足，无法抵扣',
  isBillRequesting: false,
  isCouponRequesting: true,
  noCouponTip: '不使用优惠券',
  selectedCoupon: '',
  // useCredits: false,
  useCoupon: false,
  userInfo: {
    // currentCredits: 0,
    currentCoupons: [
      {
        description: "春日满100减10优惠券",
        discountAmount: 10,
        limitAmount: 100,
        name: "春日满减券",
        id: '1',
        overdueDate: 0,
        userId: ""
      }
    ]
  },
  estimatedCost: 0,
  billForm: {
    couponId: null,
    description: '',
    totalAmount: 0,
  },
  myHistoryBills: []
})

const useCoupon = () => {
  pageData.useCoupon = pageData.selectedCoupon !== '';
  calcNewCost()
}

const billValidate = () => {
  calcNewCost()
  if (pageData.estimatedCost <= 0 || pageData.billForm.totalAmount <= 0) {
    Notification.Notify('请输入正确的金额', {title: '出错了', type: 'error'})
    return false
  }
  if (pageData.billForm.description.length < 1) {
    Notification.Notify('请输入商品名', {title: '出错了', type: 'error'})
    return false
  }
  return true
}

/**
 * @function calcNewCost
 * @description Calculate new estimatedCost for display, and it doesn't change billForm.totalAmount
 */
const calcNewCost = () => {
  pageData.estimatedCost = parseFloat(pageData.billForm.totalAmount)

  let discountAmount =
      pageData.userInfo.currentCoupons.find(item => item.id === pageData.selectedCoupon)
          ? pageData.userInfo.currentCoupons.find(item => item.id === pageData.selectedCoupon).discountAmount
          : 0

  if (pageData.useCoupon) {
    pageData.estimatedCost -= discountAmount
  } else {
    pageData.estimatedCost = pageData.billForm.totalAmount
  }

  // if (pageData.useCoupon) {
  //   pageData.billForm.totalAmount = pageData.estimatedCost - discountAmount
  // } else {
  //   pageData.billForm.totalAmount = pageData.estimatedCost
  // }

  // 暂不开放积分抵扣
  // if (pageData.useCredits) {
  //   if (pageData.useCoupon) {
  //     pageData.billForm.totalAmount = pageData.estimatedCost - 10 - discountAmount
  //   } else {
  //     pageData.billForm.totalAmount = pageData.estimatedCost - 10
  //   }
  // } else {
  //   if (pageData.useCoupon) {
  //     pageData.billForm.totalAmount = pageData.estimatedCost - discountAmount
  //   } else {
  //     pageData.billForm.totalAmount = pageData.estimatedCost
  //   }
  // }

  if (pageData.billForm.totalAmount < 0) {
    pageData.billForm.totalAmount = 0
    Notification.Notify('输入金额有误，请重新输入', {title: '出错了', type: 'error'})
  }
}

/**
 * @function doCreateBill
 * @description Create a new bill
 * @example data = {
 *   "couponId": "",
 *   "description": "",
 *   "totalAmount": 0
 * }
 * */
const doCreateBill = () => {
  pageData.isBillRequesting = true

  // pageData.billForm.couponId = pageData.selectedCoupon

  if (billValidate()) {
    // 调用接口
    PurchaseApi.postCreateBill(pageData.billForm)
        .then(res => {
          return Notification.Notify(res, {type: 'success', title: '成功'})
        })
        // .then(() => {
        //   if (pageData.useCredits) {
        //     return PurchaseApi.getUserCreditsUse(10)
        //   }
        // })
        // .then(res => {
        //   if (pageData.useCredits) {
        //     console.log(res)
        //     store.commit('minusUserCredits')
        //   }
        // })
        .catch(err => {
          console.log(err)
          Notification.Notify(err, {type: 'error', title: '失败'})
        })
        .finally(() => {
          pageData.isBillRequesting = false
          let timer = setTimeout(() => {
            clearTimeout(timer)
            window.location.reload()
          }, 2000)
        })
  }
}

// watch(() => pageData.useCredits, () => {
//   calcNewCost()
// })

watch(() => pageData.selectedCoupon, (newVal) => {
  if (newVal !== '') {
    pageData.billForm.couponId = newVal
  }
  // calcNewCost()
})

watch(() => store.state.userInfo, (newVal) => {
  // pageData.userInfo.currentCredits = newVal.credits
  pageData.userInfo.currentCoupons = newVal.coupons

  // if (pageData.userInfo.currentCredits < 100) {
  //   pageData.creditsAvailable = false
  //   pageData.creditsDisabledTooltip = '您的积分不足，无法抵扣'
  // } else {
  //   pageData.creditsAvailable = true
  // }

  if (pageData.userInfo.currentCoupons.length > 0) {
    pageData.isCouponRequesting = false
  } else {
    pageData.noCouponTip = '暂无优惠券'
  }
}, {immediate: true, deep: true})

watch(() => store.state.userBills, (newVal) => {
  pageData.myHistoryBills = newVal
}, {immediate: true, deep: true})
</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ffff3c 0, #e6ff48 10%, #c3ff56 20%, #9dff63 30%, #73ff6e 40%, #3cf278 50%, #00e381 60%, #00d689 70%, #00cb93 80%, #00c29c 90%, #00bba7 100%);
  animation: initiation 1s forwards;
}

.container {
  max-width: 1200px;
}
</style>
