<template>
  <div class="bg-gray-50 pb-24 background-wrap">
    <div class="head-banner__boundary overflow-hidden">
      <div class="head-banner__container">
        <img class="mx-auto" :src="bannerImg" alt="积分兑换">
      </div>
    </div>

    <div class="container mx-auto">
      <div class="w-full h-96">
        <h1 class="text-5xl italic mb-5 text-center my-10">积分兑换优惠券</h1>
        <div class="flex justify-around items-center">
          <div class="left">
            <div class="credits_container p-10 text-center rounded-2xl border bg-white shadow-lg hover:shadow-2xl transition-all">
              <h1 class="text-6xl font-black">{{ pageData.myCredit }}</h1>
              <h1 class="text-2xl">当前积分</h1>
            </div>
            <h1 class="text-2xl my-10">向右滚动列表可查看更多信息</h1>
          </div>

          <el-table
              :data="pageData.availableCoupons"
              stripe
              style="width: 700px"
              height="300"
              max-height="500"
              empty-text="目前没有可供兑换的优惠券，请稍后再来看看。"
          >
            <el-table-column prop="name" label="优惠券名称" fixed="left" width="180"/>
            <el-table-column prop="description" label="优惠券描述" width="230"/>
            <el-table-column prop="exchangeScore" sortable label="所需积分" width="120"/>
            <el-table-column prop="discountAmount" sortable label="优惠额度(¥)" width="150"/>
            <el-table-column prop="limitAmount" sortable label="使用门槛(¥)" width="130"/>
            <el-table-column prop="id" label="优惠券ID" width="200"/>
            <el-table-column prop="overdueDate" sortable label="过期时间" width="180"/>
            <el-table-column fixed="right" width="75" label="操作">
<!--              <template #header>-->
<!--                <el-input v-model="pageData.search" size="small" placeholder="搜索" />-->
<!--              </template>-->
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleExchange(scope.$index, scope.row)">
                  兑换
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import bannerImg from '@/assets/images/banner_credits.png'
import {PurchaseApi, UserInfoApi} from "@/js/Requests"
import {reactive, watch} from "vue"
// import {reactive, watch, computed} from "vue"
import {useStore} from "vuex"
import Notification from "@/js/Utilities/Notification"
import {getExchangeableCoupons} from "@/js/Utilities/RequestsUser";

const store = useStore()

let pageData = reactive({
  search: '',
  myCredit: 0,
  availableCoupons: [],
})

// const filterTableData = computed(() =>
//     pageData.availableCoupons.filter(
//         (data) => {
//           console.log(data)
//           return !pageData.search.value ||
//           data.name.toLowerCase().includes(pageData.search.toLowerCase())
//         }
//     )
// )

/**
 * @function handleExchange
 * @description 兑换优惠券
 * @param {number} index
 * @param {object} row
 * */
const handleExchange = (index, row) => {
  // console.log(index, row)
  PurchaseApi.getCreditsExchangeCoupon(row.id)
      .then(res => {
        if (res.search("兑换成功") === 0) {
          Notification.Notify(res, {type: "success", message: "兑换成功"})
        } else {
          Notification.Notify(res, {type: "error", message: "兑换失败"})
        }
      })
      .catch(err => {
        err.text()
            .then(text => {
              console.log(text)
              Notification.Notify(text, {type: 'error', title: '兑换失败'})
            })
        // Notification.Notify(err, {type: 'error', title: '兑换失败'})
      })
}

UserInfoApi.getExchangeableCoupons()
    .then(res => {
      pageData.availableCoupons = res
      // console.log('availableCoupons', res)
    })
    .catch(err => {
      Notification.Notify(err, {
        title: '获取可兑换优惠券失败',
        type: 'error'
      })
    })
    .finally(() => {
      pageData.isBtnLoading = false
    })

watch(() => store.state.userInfo, (newVal) => {
  pageData.myCredit = newVal.credits
}, {immediate: true, deep: true})

</script>

<style scoped>
.head-banner__container {
  height: 400px;
  animation: initiation 1s forwards;
  background-image: radial-gradient(circle at 50% -20.71%, #a3a7ff 0, #7a8ffc 25%, #3c78f2 50%, #0063e8 75%, #0051de 100%);
}

.container {
  max-width: 1200px;
}

/*.background-wrap {*/
/*  min-height: 1200px;*/
/*}*/
</style>
