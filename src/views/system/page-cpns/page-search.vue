<script setup lang="ts">
import {reactive, ref} from 'vue'
import {Refresh, Search} from "@element-plus/icons-vue"
import type {FormInstance, FormRules} from 'element-plus'

// 表单数据类型定义
interface FormData {
  username: string
  email: string
  role: string
  status: number | string
  createTime: [Date, Date] | []
}

// 表单响应式数据对象
const formData = reactive<FormData>({
  username: '',
  email: '',
  role: '',
  status: null,
  createTime: []
})

// 表单验证规则
// const rules = reactive<FormRules<FormData>>({
//   username: [
//     { required: true, message: '请输入用户名', trigger: 'blur' }
//   ],
//   email: [
//     { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
//   ],
//   role: [
//     { required: true, message: '请选择角色', trigger: 'change' }
//   ],
//   status: [
//     { required: true, message: '请选择状态', trigger: 'change' }
//   ],
//   createTime: [
//     { type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }
//   ]
// })

const formRef = ref<FormInstance>()

// 重置表单方法
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  emits('resetClick')
}

// 查询方法
//定义提交的事件
const emits = defineEmits(['queryClick', 'resetClick'])
const handleSearch = async (formEl: FormInstance | undefined) => {
  console.log('查询按钮被点击')
  try {
    await formRef.value?.validate()
    emits('queryClick', formData)
    console.log('验证通过，提交数据:', formData)
    // 这里添加实际的查询逻辑
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}
</script>

<template>
  <div class="search">
    <el-form
        label-width="100px"
        label-position="right"
        :model="formData"
        ref="formRef"
    >
      <el-row :gutter="20">
        <!-- 用户名 -->
        <el-col :span="8">
          <el-form-item label="用户名" prop="username">
            <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                clearable
            />
          </el-form-item>
        </el-col>

        <!-- 用户邮箱 -->
        <el-col :span="8">
          <el-form-item label="用户邮箱" prop="email">
            <el-input
                v-model="formData.email"
                placeholder="请输入邮箱"
                clearable
            />
          </el-form-item>
        </el-col>

        <!-- 角色 -->
        <el-col :span="8">
          <el-form-item label="角色" prop="role">
            <el-select
                v-model="formData.role"
                placeholder="请选择角色"
                clearable
                default-first-option
            >
              <el-option label="管理员" value="admin"/>
              <el-option label="编辑" value="editor"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 状态 -->
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="formData.status"
                placeholder="请选择状态"
                default-first-option
            >
              <el-option label="启用" :value="1"/>
              <el-option label="禁用" :value="0"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 创建时间 -->
        <el-col :span="8">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
                v-model="formData.createTime"
                type="daterange"
                range-separator="To"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                :size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <div class="btns">
        <el-button
            type="primary"
            :icon="Search"
            @click="handleSearch"
        >
          查询
        </el-button>
        <el-button
            :icon="Refresh"
            @click="resetForm(formRef)"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.search {
  padding: 10px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-form-item {
  width: 100%;
  margin-bottom: 16px;
}

.btns {
  text-align: right;
  margin: 16px 20px 0;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

/* 按钮间距调整 */
.el-button + .el-button {
  margin-left: 12px;
}
</style>