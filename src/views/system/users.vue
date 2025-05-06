<script setup lang="ts">
import user_search from "./user-cpns/user_search.vue"
import user_content from './user-cpns/user_content.vue'
import UserModal from './user-cpns/user_modal.vue'
import {ref} from "vue";
import {Instance} from "element-plus";

const userContentRef = ref<InstanceType<typeof user_content>>()
const modelRef = ref<InstanceType<typeof UserModal>>()
const handleQueryClick = (formData: any) => {
  userContentRef.value?.fetchUserList(formData)
}
const resetQueryClick = (formData: any) => {
  userContentRef.value?.fetchUserList({})
}
const handleNewClick=()=>{
  modelRef.value?.setVisible()
}
const handleEditClick=(itemData:any)=>{
  console.log('父组件',itemData)
  modelRef.value?.setVisible(true,itemData)
}
</script>
<template>
  <div class="user">用户管理
    <user_search @queryClick="handleQueryClick" @resetClick="resetQueryClick"/>
    <user_content ref="userContentRef" @new-click="handleNewClick" @edit-click="handleEditClick"/>
    <UserModal ref="modelRef"/>
  </div>
</template>
<style scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

</style>