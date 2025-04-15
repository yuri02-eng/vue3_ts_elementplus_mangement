<script setup>
</script>
<!-- App.vue -->
<template>
  <div class="common-layout">
  <router-view></router-view> <!-- Login和Home在此渲染 -->
  </div>
</template>
<style scoped>
.common-layout{
    position: fixed; /* 更现代的写法 */
    inset: 0;        /* 替代 top/right/bottom/left */
    overflow: auto;  /* 支持滚动 */
}
</style>