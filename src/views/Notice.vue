<template>
  <div class="notice-list">
    <el-table :data="pageData.notices" height="500" stripe style="width: 100%" empty-text="暂无通知">
      <el-table-column prop="content" label="通知内容" width="550"></el-table-column>
      <el-table-column prop="createDate" label="日期"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import {UserInfoApi} from "@/js/Requests";
import Notification from "@/js/Utilities/Notification";

const date = new Date()
const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

let pageData = reactive({
  notices: []
});

UserInfoApi.getNoticeList(0, 25)
    .then(res => {
      pageData.notices = res
    })
    .catch(err => {
      console.log(err)
      Notification.TopMsg(err, {type: "error"})
    })
</script>

<style scoped>

</style>
