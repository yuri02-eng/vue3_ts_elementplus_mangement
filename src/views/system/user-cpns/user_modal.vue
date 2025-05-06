<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import usersStore from "@/stores/system/users";

const centerDialogVisible = ref(false)
const roledepStore = usersStore()
const isEditRef = ref(false)
function setVisible(isEdit: boolean = false, itemData: any) {
  if (isEdit) {
    // 这里是编辑逻辑
    isEditRef.value = true
    if (itemData) {
      for (const key in formData) {
        formData[key] = itemData[key]
      }
    }
  }else{
    isEditRef.value = false
    for(const key in formData){
      formData[key] = ''
    }
  }
  centerDialogVisible.value = true
}

defineExpose({
  setVisible
})
const formDataRef = ref<FormInstance>()
const formData = reactive<FormData>({
  username: '',
  email: '',
  role: '',
  status: null,
  createTime: []
})

function handleCancelDialog(formEl: FormInstance | undefined) {
  formEl.resetFields()
  centerDialogVisible.value = false
}

function handleConfirmDialog() {
  //判断是否是编辑状态，是编辑状态更新数据，不是就添加数据
  //这里发送网络请求到后端进行用户的添加
  //还要进行重新请求的数据展示调用请求数据刷新
  centerDialogVisible.value = false
}

const handleBeforeClose = (done) => {
  // 这里可以加二次确认逻辑
  ElMessageBox.confirm('确认关闭？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formDataRef.value.resetFields()
    done()
  }).catch(() => {
    // 用户点击取消，保持对话框打开
  })
}
</script>

<template>
  <el-dialog
      v-model="centerDialogVisible"
      title="新建用户"
      width="500"
      center
      :before-close="handleBeforeClose"
  >
    <div class="form">
      <el-form :model="formData" label-width="120px" ref="formDataRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择用户角色">
            <template v-for="item in roledepStore.roles" :key="item.id">
              <el-option :label="item.name" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="!isEditRef">
          <el-select  v-model="formData.department" placeholder="请选择用户状态部门">
            <template v-for="item in roledepStore.departments" :key="item.id">
              <el-option :label="item.name" :value="item.parentId"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancelDialog(formDataRef)">取消</el-button>
        <el-button type="primary" @click="handleConfirmDialog(formDataRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.form {
  padding: 0 40px 0 0;
}
</style>