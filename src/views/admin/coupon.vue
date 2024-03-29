<template>
  <div class="coupon-container px-5 grid grid-cols-1 lg:grid-cols-2 gap-10">

    <div class="left">
      <h1 class="text-2xl italic mb-5">优惠券发放</h1>
      <el-form v-model="pageData.newCoupon" :label-width="120">
        <el-form-item label="优惠券名称">
          <el-input
              v-model="pageData.newCoupon.name"
              :minlength="1"
              :maxlength="50"
              show-word-limit
              placeholder="优惠券名称不宜过长"
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠券描述">
          <el-input
              v-model="pageData.newCoupon.description"
              :minlength="1"
              :maxlength="100"
              show-word-limit
              placeholder="优惠券描述，如满100减10"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用门槛">
          <el-input
              v-model="pageData.newCoupon.limitAmount"
              :min="1"
              :max="200"
              placeholder="可以开始使用此券的订单金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input
              v-model="pageData.newCoupon.discountAmount"
              :min="1"
              :max="200"
              placeholder="请输入优惠金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker
              v-model="pageData.selectedDate"
              type="datetime"
              placeholder="选择日期时间"
              :default-time="today"
          />
          <span class="mx-3 text-gray-500">默认24小时之后失效</span>
        </el-form-item>
        <el-form-item label="单独发放">
          <el-switch
              v-model="pageData.isForExactUser"
              class="mt-2"
              size="small"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </el-form-item>
        <el-collapse-transition>
          <div v-if="pageData.isForExactUser">
            <el-form-item label="用户ID">
              <el-input
                  v-model="pageData.newCoupon.userId"
                  placeholder="要单独发放到的用户ID"
                  readonly
              ></el-input>
              <el-button title="点击打开用户列表选择用户" type="primary" @click="onUserListOpenClick">用户列表</el-button>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <el-form-item label="兑换积分" v-if="!pageData.isForExactUser">
            <el-input
                v-model="pageData.newCoupon.exchangeScore"
                placeholder="兑换此优惠券所需积分"
            ></el-input>
          </el-form-item>
        </el-collapse-transition>
      </el-form>
      <div class="text-center">
        <el-button
            @click="onCouponSubmit"
            :loading="pageData.isSubmitBtnLoading"
            type="primary"
            size="large"
            class="px-5"
        >
          创建优惠券
        </el-button>
      </div>
    </div>

    <div class="right">
      <h1 class="text-2xl italic mb-5">优惠券删除</h1>
      <el-form>
        <el-form-item label="优惠券ID">
          <el-input
              v-model="pageData.deleteCouponId"
              clearable
              placeholder="要删除的优惠券ID"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-popconfirm
            title="您确定要删除这张优惠券吗"
            confirm-button-text="是的"
            confirm-button-type="danger"
            cancel-button-text="不是"
            @Confirm="onCouponDelete"
        >
          <template #reference>
            <el-button
                :loading="pageData.isDeleteBtnLoading"
                type="danger"
                size="large"
                class="px-5"
            >
              删除优惠券
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-dialog v-model="pageData.isUserListVisible" destroy-on-close draggable width="">
      <userList @selectedUser="handleSelect"></userList>
    </el-dialog>

  </div>
</template>

<script setup>
import {reactive, watch} from "vue";
import {Check, Close} from '@element-plus/icons-vue';
import Notification from "@/js/Utilities/Notification";
import {AdminApi} from "@/js/Requests";
import UserList from "@/views/admin/userList.vue";

let today = new Date().valueOf();
let tomorrow = new Date(today + 24 * 60 * 60 * 1000).valueOf();

let pageData = reactive({
  isSubmitBtnLoading: false,
  isUserListVisible: false,
  isDeleteBtnLoading: false,
  isForExactUser: false,
  isSelectDateChange: false,
  selectedDate: tomorrow,
  newCoupon: {
    name: '',
    description: '',
    discountAmount: null,
    exchangeScore: null,
    limitAmount: null,
    overdueTime: null,
    userId: null
  },
  deleteCouponId: null,
});

const handleSelect = (arg) => {
  // console.log(arg)
  if (arg !== "" || arg !== null) {
    pageData.newCoupon.userId = arg
    pageData.isUserListVisible = false
  }
}

const couponValidation = () => {
  if (pageData.newCoupon.name === null || pageData.newCoupon.name === '') {
    Notification.Notify('请输入优惠券名称', {type: 'warning'})
    return false
  }

  if (pageData.newCoupon.description === null || pageData.newCoupon.description === '') {
    Notification.Notify('请输入优惠券描述', {type: 'warning'})
    return false
  }

  if (pageData.newCoupon.limitAmount === null || pageData.newCoupon.limitAmount === '') {
    Notification.Notify('请输入限制金额', {type: 'warning'})
    return false
  }

  if (pageData.newCoupon.discountAmount === null || pageData.newCoupon.discountAmount === '') {
    Notification.Notify('请输入优惠金额', {type: 'warning'})
    return false
  }

  if (parseFloat(pageData.newCoupon.limitAmount) > 0) {
    if (parseFloat(pageData.newCoupon.limitAmount) < parseFloat(pageData.newCoupon.discountAmount)) {
      Notification.Notify('优惠金额不能大于优惠券限制金额', {type: 'warning'})
      return false
    }
  }

  if (pageData.isForExactUser) {
    pageData.newCoupon.exchangeScore = null
    if (pageData.newCoupon.userId === null || pageData.newCoupon.userId === '') {
      Notification.Notify('请输入用户ID', {type: 'warning'})
      return false
    }
  } else {
    pageData.newCoupon.userId = null
    if (pageData.newCoupon.exchangeScore === null || pageData.newCoupon.exchangeScore === '') {
      Notification.Notify('请输入兑换积分', {type: 'warning'})
      return false
    }
  }

  if (!pageData.isSelectDateChange) {
    pageData.newCoupon.overdueTime = pageData.selectedDate
  }

  return true
}

const delCouponValidation = () => {
  if (!pageData.deleteCouponId) {
    Notification.Notify('请输入要删除的优惠券ID', {type: 'warning'})
    return false
  }
  return true
}

const onCouponSubmit = () => {
  pageData.isSubmitBtnLoading = true
  if (couponValidation()) {
    AdminApi.postCouponCreate(pageData.newCoupon)
        .then(res => {
          Notification.Notify(`优惠券ID：${res}`, {type: 'success', title: '创建优惠券成功'})
        })
        .catch(err => {
          Notification.Notify(err, {type: 'error', title: '创建优惠券失败'})
        })
        .finally(() => {
          pageData.isSubmitBtnLoading = false
        })
  }
}

const onCouponDelete = () => {
  pageData.isDeleteBtnLoading = true
  if (delCouponValidation()) {
    AdminApi.deleteCoupon(pageData.deleteCouponId)
        .then(res => {
          Notification.Notify(res, {type: 'success', title: '删除优惠券成功'})
        })
        .catch(err => {
          Notification.Notify(err, {type: 'error', title: '删除优惠券失败'})
        })
        .finally(() => {
          pageData.deleteCouponId = null
          pageData.isDeleteBtnLoading = false
        })
  }
}

const onUserListOpenClick = () => {
  pageData.isUserListVisible = true
}

watch(() => pageData.selectedDate, (newVal) => {
  pageData.newCoupon.overdueTime = new Date(newVal).getTime();
  pageData.isSelectDateChange = true
});
</script>

<style scoped>

</style>
