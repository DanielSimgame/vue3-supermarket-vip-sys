<template>
<!--  59c6a741-ba92-4197-94c9-6e0535d8dbc3-->
  <div class="users-container px-5">
    <h1 class="text-2xl italic mb-5">用户管理</h1>
    <el-input
        v-model="pageData.deleteUserId"
        placeholder="请输入要删除的用户id"
        autofocus
        size="large"
    ></el-input>
    <div class="text-center mt-5">
      <el-popconfirm
          title="您确定要删除这个用户吗？"
          confirm-button-text="是的"
          confirm-button-type="danger"
          cancel-button-text="不是"
          @Confirm="onDeleteUserClick"
      >
        <template #reference>
          <el-button
              type="danger"
              size="large"
              :loading="pageData.isBtnLoading"
              :disabled="pageData.isBtnLoading"
          >
            删除用户
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import {AdminApi} from "@/js/Requests";
import Notification from "@/js/Utilities/Notification";

let pageData = reactive({
  isBtnLoading: false,
  deleteUserId: '',
})

const deleteUserValidation = () => {
  if (pageData.deleteUserId === '') {
    Notification.Notify('请输入要删除的用户id', {type: 'warning', title: '警告'})
    return false
  }
  return true
}

const onDeleteUserClick = () => {
  pageData.isBtnLoading = true;
  if (deleteUserValidation()) {
    AdminApi.deleteUser(pageData.deleteUserId)
        .then(res => {
          Notification.Notify('删除用户成功', {type: 'success', title: '成功'});
          pageData.isBtnLoading = false;
        })
  }
}
</script>

<style scoped>

</style>
