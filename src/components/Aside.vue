<script setup lang="ts">

import {useRoute} from 'vue-router'
import useLoginStore from "@/stores/login";
import {computed, ref} from "vue";

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const loginStore = useLoginStore()
const userMenus = loginStore.userMenus


console.log(userMenus, typeof userMenus)
// console.log(JSON.parse(userMenus))

const props = defineProps({
  isFold: Boolean,
})
const route = useRoute()
const path = ref(route.path)
// const activeDefault=mapPathToMenu(route.path, userMenus)
const activeDefault = computed(()=>{
  const id =mapPathToMenu(route.path, userMenus)
  console.log('55555555555555',id)
  return id+''
})
console.log('activeDefault',activeDefault.value)
function mapPathToMenu(path: string, userMenus: any) {
  for (const menu of userMenus) {
    for (const subMenu of menu.children) {
      if (subMenu.path === path) {
        return subMenu.path
      }
    }
  }
  return undefined
}
</script>
<template>
  <div class="container">
    <!-- 页面内容 -->

<!--    <div>-->
<!--      <el-menu-->
<!--          default-active="/home"-->
<!--          class="el-menu-vertical-demo"-->
<!--          :router="true"-->
<!--          :collapse=props.isFold-->
<!--          @open="handleOpen"-->
<!--          @close="handleClose"-->
<!--          text-color="#b7bdc3" active-text-color="#fff" background-color="#001529"-->
<!--      >-->
<!--        <el-menu-item index="/home">-->
<!--          <el-icon>-->
<!--            <icon-menu/>-->
<!--          </el-icon>-->
<!--          <span>首页</span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/classes">-->
<!--          <el-icon>-->
<!--            <icon-menu/>-->
<!--          </el-icon>-->
<!--          <span>课程管理</span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/product">-->
<!--          <el-icon>-->
<!--            <document/>-->
<!--          </el-icon>-->
<!--          <span>商品管理</span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/content">-->
<!--          <el-icon>-->
<!--            <setting/>-->
<!--          </el-icon>-->
<!--          <span>仓库管理</span>-->
<!--        </el-menu-item>-->
<!--      </el-menu>-->
<!--    </div>-->
    <el-menu text-color="#b7bdc3" active-text-color="#fff" background-color="#001529" :default-active="activeDefault" @open="handleOpen" @close="handleClose"
             :collapse=props.isFold :router="true" >
      <template v-for="item in userMenus" :key="item.id">
        <el-sub-menu :index="item.path">
          <template #title>
            <el-icon>
              <Component :is="item.icon.split('el-icon-')[1]"></Component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">{{ subItem.name }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>

</template>
<style scoped>
.container {
  background-color: white;
  height: 100%;
}

.el-menu-item {
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-left: 0;
}

.el-menu {

}


</style>