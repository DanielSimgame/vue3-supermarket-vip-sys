<template>
  <div class="events-container overflow-y-scroll px-5">
    <h1 class="text-2xl italic mb-5">活动信息推送</h1>
    <el-input
        v-model="pageData.activityDesc"
        type="textarea"
        :autosize="{minRows: 10, maxRows: 20}"
        autofocus
        size="large"
        placeholder="请输入推送的活动通知内容"
        maxlength="500"
        show-word-limit
    ></el-input>
    <div class="text-center mt-5">
      <el-button
          type="primary"
          size="large"
          @click="onActivitySubmit"
          :loading="pageData.isBtnLoading"
          :disabled="pageData.isBtnLoading"
      >
        推送活动通知
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import {AdminApi} from "@/js/Requests"
import Notification from "@/js/Utilities/Notification"

let pageData = reactive({
  isBtnLoading: false,
  activityDesc: '',
})

const onActivitySubmit = () => {
  AdminApi.getActivityPush(pageData.activityDesc)
      .then(res => {
        Notification.Notify(res, {type: 'success', title: '成功'})
        pageData.activityDesc = ''
      })
      .catch(err => {
        Notification.Notify(err, {type: 'error', title: '活动信息推送失败'})
      })
      .finally(() => {
        pageData.isBtnLoading = false
      })
}

</script>

<style scoped>
.events-container {
  height: 700px;
}
</style>
