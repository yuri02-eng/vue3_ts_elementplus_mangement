
<script setup lang="ts">
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import Main from "@/components/Main.vue"
import Aside from "@/components/Aside.vue";

import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter
} from 'element-plus'
</script>
<template>
    <el-container>
    <el-header><Header /></el-header>
    <el-container>
    <el-aside width="200px"><Aside /></el-aside>
    <el-container>
    <el-main><router-view></router-view></el-main>
    <el-footer><Footer /></el-footer>
    </el-container>
    </el-container>
    </el-container>
</template>
<style scope>

  .el-container {
    height: 100%;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 80px; /* 调整字体间隔 */
    height: 80px; /* 增加头部高度以适应新的字体间隔 */
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>

