<script setup>
  import { useUserStore } from '@/stores/userStore';
  const userStore = useUserStore();
</script>

<template>
  <div>{{ userStore.name }}</div>
  <el-button @click="userStore.updateName('Tom')">Change Name</el-button>
</template>
<style scoped>

</style>