<template>
  <div class="bg-gray-50">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="商城">
      </div>
    </div>

    <div class="container mx-auto overflow-hidden">
      <div class="store-detail-main grid grid-cols-1 md:grid-cols-2 p-5">

        <div class="product-img">
          <img class="mx-auto" :src="productImg" alt="商品">
        </div>

        <div class="product-details">
          <div class="product-title mb-2.5">
            <h1 class="text-2xl font-bold">{{ pageData.productTitle }}</h1>
            <h2 class="text-lg text-red-500">{{ pageData.productSubTitle }}</h2>
          </div>

          <div class="product-price my-2.5">
            <h2 class="text-3xl font-bold text-red-500">¥{{ pageData.productPrice }}</h2>
            <h2 class="text-lg">包邮</h2>
          </div>

          <div class="product-monthly-sales my-2.5">
            <h2 class="text-md">
              月销量
              <span class="text-red-500 font-bold">
                {{ parseInt(pageData.productMonthlySales) > 999 ? '999+' : pageData.productMonthlySales }}
              </span>
            </h2>
          </div>

          <div class="product-description my-2.5">
            <p>{{ pageData.productDescription }}</p>
          </div>

          <el-divider content-position="left">结算</el-divider>

          <div class="product-purchase-info my-2.5">
            <el-input-number v-model="pageData.form.quantity" :min="1" :max="pageData.productMaxQuantity"
                             class="mr-2"></el-input-number>
            件
          </div>

          <div class="product-purchase-info-credits my-2.5">
            <el-tooltip
                class="box-item"
                effect="dark"
                :content="pageData.creditsDisabledTooltip"
                placement="right"
                :visible="!pageData.creditsAvailable"
            >
              <el-checkbox
                  v-model="pageData.form.useCredits"
                  class="text-md"
                  :disabled="!pageData.creditsAvailable"
              >
                使用
                <span class="font-bold">{{ pageData.productCreditsLimit }}</span>
                积分抵扣
                <span class="font-bold text-red-500">10</span>
                元
              </el-checkbox>
            </el-tooltip>
          </div>

          <div class="product-purchase-info-coupon my-2.5">
            <el-select
                v-model="pageData.form.selectedCoupon"
                @change="useCoupon()"
                placeholder="选择优惠券"
            >
              <el-option
                  label="不使用优惠券"
                  value=""
              >
                <span class="text-md">不使用优惠券:</span>
                <span class="text-sm text-gray-500">无优惠</span>
              </el-option>
              <el-option
                  v-for="item in pageData.userInfo.currentCoupons"
                  :key="item.couponId"
                  :label="item.name"
                  :value="item.couponId"
                  :disabled="item.limitAmount < pageData.form.quantity"
              >
                <span class="text-md">{{ item.name }}</span>
                <span>:</span>
                <span class="text-sm text-gray-500">{{ item.description }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="product-purchase-info my-2.5">
            <h2 class="text-3xl">
              <span>实付款</span>
              <span class="font-bold text-red-500">
                ¥{{ pageData.form.totalCash }}
              </span>
            </h2>
          </div>

          <div class="product-button my-2.5">
            <el-button type="primary" @click="purchase">购买</el-button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_store.png'
import productImg from '@/assets/images/product.jpg'
import {onMounted, reactive, watch} from "vue"
import {useStore} from "vuex"
import Notification from "@/js/Utilities/Notification"
import {PurchaseApi} from "@/js/Requests"

const store = useStore()

let pageData = reactive({
  productTitle: '金龙鱼精炼一级大豆油5Lx4桶 家用食用油 桶装',
  productSubTitle: '精炼一级大豆油 4桶5升共20升',
  productPrice: '275.50',
  productMaxQuantity: 2,
  productMonthlySales: '0',
  productDescription: '每人限购2件。益海嘉里（武汉）粮油工业有限公司生产，产地直销只为您的健康用油。',
  productCreditsLimit: '100',
  creditsAvailable: false,
  creditsDisabledTooltip: `您的积分不足，无法抵扣`,
  couponLoading: false,
  userInfo: {
    currentCredits: 0,
    currentCoupons: [
      {
        description: "春日满100减10优惠券",
        discountAmount: 10,
        limitAmount: 100,
        name: "春日满减券",
        couponId: '1',
        overdueTime: 0,
        userId: ""
      }
    ]
  },
  form: {
    quantity: 1,
    originalTotalCash: 0,
    totalCash: 0,
    useCredits: false,
    useCoupon: false,
    selectedCoupon: ''
  },
})

// pageData.form.originalTotalCash = parseFloat(pageData.productPrice) * pageData.form.quantity
// pageData.form.totalCash = pageData.form.originalTotalCash

watch(() => pageData.form.quantity, () => {
  calcNewCost()
})

watch(() => pageData.form.useCredits, () => {
  calcNewCost()
})

pageData.productMonthlySales = Math.floor(Math.random() * 1000 + 200).toString()

const useCoupon = () => {
  pageData.form.useCoupon = true
  calcNewCost()
}

/**
 * @function calcNewCost
 * @description Calculate the new cost after changing quantity, using credits and coupons.
 * */
const calcNewCost = () => {
  pageData.form.originalTotalCash = parseFloat(pageData.productPrice) * pageData.form.quantity

  let discountAmount =
      pageData.userInfo.currentCoupons.find(item => item.couponId === pageData.form.selectedCoupon)
          ? pageData.userInfo.currentCoupons.find(item => item.couponId === pageData.form.selectedCoupon).discountAmount
          : 0

  if (pageData.form.useCredits) {
    if (pageData.form.useCoupon) {
      pageData.form.totalCash = pageData.form.originalTotalCash - 10 - discountAmount
    } else {
      pageData.form.totalCash = pageData.form.originalTotalCash - 10
    }
  } else {
    if (pageData.form.useCoupon) {
      pageData.form.totalCash = pageData.form.originalTotalCash - discountAmount
    } else {
      pageData.form.totalCash = pageData.form.originalTotalCash
    }
  }
}

const formValidation = () => {
  if (pageData.form.quantity > pageData.productMaxQuantity) {
    return '超出购买数量'
  }
  if (pageData.form.quantity <= 0) {
    return '购买数量不能小于1'
  }
  return ''
}

const purchase = () => {
  console.log('purchase')
  let data = {
    couponId: null,
    description: null,
    totalAmount: 0
  }
  // 表单验证
  const error = formValidation()
  if (error !== '') {
    Notification.Notify(error, {type: 'warning', title: '警告'})
  } else {
    data.description = pageData.productTitle

    if (pageData.form.useCredits && pageData.form.useCoupon) {
      // 既使用积分也使用优惠券
      data.couponId = pageData.userInfo.currentCoupons[0].id
      data.totalAmount = pageData.form.totalCash
    } else if (pageData.form.useCredits) {
      // 使用积分
      data.totalAmount = pageData.form.totalCash
    } else if (pageData.form.useCoupon) {
      // 使用优惠券
      data.couponId = pageData.userInfo.currentCoupons[0].id
      data.totalAmount = pageData.form.totalCash
    } else {
      // 不使用积分也不使用优惠券
      data.totalAmount = pageData.form.totalCash
    }

    // 调用接口
    PurchaseApi.postCreateBill(data)
        .then(res => {
          Notification.Notify(res, {type: 'success', title: '成功'})
        })
        .catch(err => {
          console.log(err)
          Notification.Notify(err, {type: 'error', title: '失败'})
        })
    // Notification.Notify('购买成功', {type: 'success', title: '成功'})
  }
}

watch(() => Store.state.userInfo, (newVal) => {
  pageData.userInfo.currentCredits = newVal.credits
  newVal.credits >= parseInt(pageData.productCreditsLimit) ?
      pageData.creditsAvailable = true :
      pageData.creditsAvailable = false
}, {immediate: true, deep: true})

onMounted(() => {
  calcNewCost()
})
</script>

<style scoped>
.head-banner__container {
  height: 400px;
  background-image: radial-gradient(circle at 50% -20.71%, #ffff3c 0, #e6ff48 10%, #c3ff56 20%, #9dff63 30%, #73ff6e 40%, #3cf278 50%, #00e381 60%, #00d689 70%, #00cb93 80%, #00c29c 90%, #00bba7 100%);
  animation: initiation 1s forwards;
}

.container {
  max-width: 1200px;
  height: 700px;
}

.product-img {
  width: 500px;
}
</style>
