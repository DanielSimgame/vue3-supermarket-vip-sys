<template>
  <div class="container mx-auto py-10">
    <el-tabs tab-position="left" style="height: 700px" class="demo-tabs">
      <el-tab-pane label="优惠券">
        <Coupon></Coupon>
      </el-tab-pane>
      <el-tab-pane label="活动推送">
        <Activity></Activity>
      </el-tab-pane>
      <el-tab-pane label="用户信息">
        <UserManage></UserManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import Coupon from '@/views/admin/coupon.vue';
import Activity from "@/views/admin/activity.vue";
import UserManage from "@/views/admin/userManage.vue";

</script>

<style scoped>
.container {
  max-width: 1200px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
