
<script setup lang="ts">
    import {  Menu,
      Document,
      Menu as IconMenu,
      Location,
      Setting,
    } from '@element-plus/icons-vue'
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    import { useRoute } from 'vue-router'
    import router from "@/stores/indes";
    const route = useRoute()
</script>
<template>
    <div class="container">
      <!-- 页面内容 -->
      <el-row class="tac">
      <el-col :span="24">

      <el-menu
          default-active="/home"
          class="el-menu-vertical-demo"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
      >
        <el-menu-item index="/home">
          <el-icon><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/classes">
          <el-icon><icon-menu /></el-icon>
          <span>课程管理</span>
        </el-menu-item>
        <el-menu-item index="/product" >
          <el-icon><document /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/project">
          <el-icon><setting /></el-icon>
          <span>仓库管理</span>
        </el-menu-item>
      </el-menu>
      </el-col>
  </el-row>
  </div>
</template>
<style scoped>
    .container {
      background-color: white;
    }
    .el-menu-item {
      border:1px solid black;
      border-radius: 10px;
      margin-bottom: 10px;
      margin-left: 0;
    }
    .el-menu{

    }
</style>