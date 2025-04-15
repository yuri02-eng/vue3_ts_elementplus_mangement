<script setup>
import {ref} from "vue"
const count=  ref(0)
const clicked = () => {
  count.value++
}
import { ElButton } from 'element-plus'
</script>

<template>
<div>
  <el-row :gutter="20">
    <!-- 管理系统 -->
    <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="6">
      <div class="grid-content"><h1>管理系统</h1></div>
    </el-col>

    <!-- 主内容区 -->
    <el-col :xs="24" :sm="12" :md="16" :lg="18" :xl="14">
      <el-button @click="clicked">计数器 {{ count }}</el-button>
    </el-col>

    <!-- 登录/退出组 -->
    <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="4">
      <div class="button-group">
        <router-link to="/login">
          <el-button type="primary">登录</el-button>
        </router-link>
        <el-button type="danger">退出</el-button>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<style scoped>
.el-col {
  border-radius: 1px;
}

.grid-content {
  border-radius: 4px;
  min-height: 3px;
}
</style>