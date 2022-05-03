<template>
  <el-table v-loading="dialogData.isLoading" :data="dialogData.userList" stripe style="width: 100%">
    <el-table-column width="75" label="头像">
      <template #default="scope">
        <el-image lazy :src="scope.row.portrait" class="rounded-full"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="昵称" width="130"/>
    <el-table-column prop="id" label="用户ID" width="320"/>
    <el-table-column fixed="right" width="75" label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleClick(scope.$index, scope.row)">
          选择
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="handlePage(-1)">上一页</el-button>
  <el-button @click="handlePage(1)">下一页</el-button>
</template>

<script setup>
import {AdminApi} from "@/js/Requests"
import {reactive, defineEmits} from "vue"
import Notification from "@/js/Utilities/Notification"

const emit = defineEmits(['selectedUser'])

let dialogData = reactive({
  userList: [],
  pageNum: 0,
  pageSize: 5,
  isLoading: true,
})

AdminApi.getUserList(dialogData.pageNum, dialogData.pageSize)
    .then(res => {
      console.log(res)
      if (res.length !== 0) {
        dialogData.userList = res
      } else {
        Notification.TopMsg('没有更多数据', {type: 'warning'})
      }
    })
    .catch(err => {
      console.log(err)
      Notification.TopMsg(err, {type: 'error'})
    })
    .finally(() => {
      dialogData.isLoading = false
    })

/**
 * @function handleClick
 * @description 选择发放用户
 * @param {number} index
 * @param {object} row
 * */
const handleClick = (index, row) => {
  emit('selectedUser', row.id)
}

const handlePage = (page) => {
  if (page === -1 && dialogData.pageNum === 0) {
    Notification.TopMsg('已经是第一页', {type: 'warning'})
    return
  }
  dialogData.isLoading = true
  dialogData.pageNum += page
  AdminApi.getUserList(dialogData.pageNum, dialogData.pageSize)
      .then(res => {
        if (res.length !== 0) {
          dialogData.userList = res
        } else {
          Notification.TopMsg('已经是最后一页', {type: 'warning'})
          dialogData.pageNum--
        }
      })
      .catch(err => {
        console.log(err)
        Notification.TopMsg(err, {type: 'error'})
      })
      .finally(() => {
        dialogData.isLoading = false
      })
}

</script>

<style scoped>

</style>