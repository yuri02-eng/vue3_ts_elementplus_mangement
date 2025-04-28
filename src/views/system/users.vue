<script setup lang="ts">
import user_search from "./user-cpns/user_search.vue"
</script>
<template>
  <div class="user">用户管理
    <user_search/>
    <div class="content">
      <div class="header">头部</div>
      <div class="table">表格信息</div>
      <div class="page">分页</div>
    </div>
  </div>
</template>
<style scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

</style>