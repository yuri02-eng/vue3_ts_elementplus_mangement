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
import {ref} from "vue";
const isCollapse=ref(false)
function handFoldChange(isFold: boolean){
  isCollapse.value=isFold
}
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>
<template>
  <el-container>
    <el-header>
      <Header @fold-change="handFoldChange"/>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <Aside :isFold="isCollapse"/>
      </el-aside>
      <el-container>
        <el-main>
          <el-config-provider :locale="zhCn">
          <router-view></router-view>
          </el-config-provider>
        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<style scope>

.el-container {
  height: 100%;
}

.el-header {
  padding: 0;
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
  transition: width 1s ease;
}

.el-main {
  background-color: #f0f2f5;
  color: #333;
  border-radius: 50px;
}
</style>

