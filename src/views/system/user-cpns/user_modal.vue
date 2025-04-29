<script lang="ts" setup>
import {ref} from 'vue'
const centerDialogVisible = ref(false)
function setVisible() {
  centerDialogVisible.value = true
}
defineExpose({
  setVisible
})
</script>

<template>
  <el-dialog v-model="centerDialogVisible" title="新建用户" width="500" center>
    <span>
      It should be noted that the content will not be aligned in center by
      default
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>