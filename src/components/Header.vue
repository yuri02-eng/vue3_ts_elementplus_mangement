<script setup lang="ts">
import {computed, ref} from "vue"
import useLoginStore from "@/stores/login.js";
import {ElButton} from 'element-plus'
import {useRoute, useRouter} from 'vue-router'
import {ArrowRight, Document, Expand, Fold} from '@element-plus/icons-vue'
import userImage from '@/assets/img/user.jpg';
import {Route} from 'vue-router'

const count = ref(0)
const isFold = ref(false)
const clicked = () => {
  count.value++
}

const router = useRouter()
const emit = defineEmits(['foldChange'])

function exitaccout() {
  console.log("退出登录")
  const useLogin = useLoginStore()
  useLogin.handleLoginError()
  console.log("exit loging")
  router.push('/login')
}

function handleMenuIconClick() {
  console.log("点击了菜单图标")
  isFold.value = !isFold.value
  emit('foldChange', isFold.value)
}

interface IBreadcrumb {
  name: string,
  path?: string
}

function mapPathToBreadcrumbs(path, userMenus: any[]) {
  // 根据路径生成面包屑
  // 这里只是一个示例，实际应根据路由配置生成面包屑
  const breadcrumbs: IBreadcrumb[] = []
  for (const menu of userMenus) {
    for (const subMenu of menu.children) {
      if (subMenu.path === path) {
        breadcrumbs.push({name: menu.name, path: menu.path})
        breadcrumbs.push({name: subMenu.name, path: subMenu.path})
      }
    }
  }
  return breadcrumbs
}

const route = useRoute()
const userMenus = useLoginStore().userMenus
const breadcrumbs = computed(() => {
  return mapPathToBreadcrumbs(route.path, userMenus)
})
</script>

<template>
  <div class="main-container">
    <div class="logo" v-show="!isFold">
      <el-icon>
        <Document></Document>
      </el-icon>
      <h2 style="display: inline-block">后台管理系统</h2>
    </div>
    <div class="userinfo">
      <div class="menu-icon" style="display: inline-flex; align-items: center;">
        <el-icon style="font-size: 28px; " @click="handleMenuIconClick">
          <component :is="isFold ? Expand : Fold"/>
        </el-icon>
        <el-breadcrumb separator-icon="ArrowRight" class="breadcrumbs">
          <template v-for="item in breadcrumbs" :key="item.name">
            <el-breadcrumb-item :to="item.path">{{ item.name }}</el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
      <!-- 登录/退出组 -->
      <div class="button-group">
        <router-link to="/login">
          <el-button type="primary">登录</el-button>
        </router-link>
        <el-button type="danger" @click="exitaccout" style="margin-left: 10px">退出</el-button>
        <div class="dropdown">
          <el-dropdown class="custom-dropdown">
            <span class="userinfo">
              <el-avatar :size="50" :src=userImage></el-avatar>
            <span>Tom</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon>
                    <CircleClose/>
                  </el-icon>
                  <span>个人信息</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon>
                    <InfoFilled/>
                  </el-icon>
                  <span>修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="exitaccout">
                  <el-icon>
                    <Unlock/>
                  </el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>

              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-col {
  border-radius: 1px;
}

.logo {
  width: 10%;
  height: 100%; /* 必须设置明确高度 */
}

.grid-content {
  border-radius: 4px;
  min-height: 3px;
}

.el-dropdown__trigger:hover {
  outline: none;
}

*:focus {
  outline: none !important;
}

.userinfo {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 90%;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px;
  margin: 0;
}

.dropdown {
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.menu-icon {
  padding: 0;
  margin: 0;
}

.info {
  align-items: center;
}

.breadcrumbs {
  display: inline-flex;;
  align-items: center;
  height: 100%;
  padding-left: 10px; /* 与图片中的折叠图标间距一致 */
}

.dropdown .userinfo {
  display: flex;
  align-items: center;
}

.dropdown span {
  margin-left: 10px;
  margin-right: 10px;
}

.custom-dropdown .el-dropdown-menu__item {
  line-height: 30px !important;
  padding: 10px 20px;
}

</style>