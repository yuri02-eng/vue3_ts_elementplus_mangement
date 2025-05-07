<script setup lang="ts">
import {ref, onMounted} from 'vue';
import axios from 'axios';
import type {ComponentSize} from 'element-plus';
import {formatUTC} from "@/utils/format";
import UserModal from "@/views/system/user-cpns/user_modal.vue";
// 分页控制参数（参考官方示例）
const paginationSize = ref<ComponentSize>('default');  // 分页尺寸
const paginationBackground = ref(false);              // 是否显示背景色
const paginationDisabled = ref(false);                // 是否禁用分页

// 数据相关状态
const userList = ref([]);       // 用户列表数据
const currentPage = ref(1);     // 当前页码（与分页组件双向绑定）
const pageSize = ref(10);       // 每页数量（与分页组件双向绑定）
const total = ref(0);           // 总数据量（从接口获取）
const loading = ref(false);     // 加载状态
const searchForm = ref({})
// 数据加载函数
const fetchUserList = async (formData: any = {}) => {
  loading.value = true;
  try {
    // 创建基础请求参数（分页+表单条件）
    const requestParams: Record<string, any> = {
      page: currentPage.value,
      limit: pageSize.value,
      ...cleanFormData(formData) // 合并清理后的表单参数
    }
    console.log("requestParams", requestParams)
    // 处理时间范围参数（根据后端接口格式要求调整）
    if (formData.createTime?.length === 2) {
      const [start, end] = formData.createTime
      requestParams.startTime = start.toISOString()  // 使用 ISO 格式
      requestParams.endTime = end.toISOString()
    }

    const res = await axios.post('/api/users/list', requestParams)

    if (res.data.code === 200) {
      searchForm.value = formData
      userList.value = res.data.data.list
      total.value = res.data.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 清理空值表单参数工具函数
const cleanFormData = (form: FormData) => {
  return Object.entries(form).reduce((acc, [key, value]) => {
    // 判断空对象：先确认是普通对象，再判断无属性
    const isEmptyObject =
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&  // 排除数组类型
        Object.keys(value).length === 0

    // 综合过滤条件
    const shouldFilter =
        value === "" ||               // 空字符串
        (Array.isArray(value) && value.length === 0) ||  // 空数组
        value == null ||              // null 或 undefined
        isEmptyObject                  // 空对象

    if (!shouldFilter) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, any>)
}


// 分页事件处理（与官方示例事件机制一致）
const onPageChange = (newPage: number) => {
  currentPage.value = newPage;  // 自动同步到分页组件
  fetchUserList(searchForm.value);              // 重新加载数据
};

// const onPageSizeChange = (newSize: number) => {
//   pageSize.value = newSize;     // 自动同步到分页组件
//   currentPage.value = 1;        // 切换每页数量后重置为第一页
//   fetchUserList(searchForm.value);              // 重新加载数据
// };
const roleConfig = {
  admin: {type: 'success', text: '管理员'},
  editor: {type: 'danger', text: '编辑'},
  user: {type: 'warning', text: '普通用户'}
};
// 初始化加载
onMounted(() => {
  fetchUserList();
});
defineExpose({
  fetchUserList
})
const handleDeleteBtnClick = (id: number) => {
  console.log('删除用户:', id);
  // 在这里添加删除用户的逻辑
}
const handleNewUserClick = () => {
  emits('newClick')
}
const handleEditBtnClick=(itemData:any)=> {
console.log(itemData)
  emits('editClick',itemData)
}
const emits=defineEmits(['newClick','editClick'])

</script>

<template>
  <div class="content">
    <div class="header">
      <h3 class="title">用户列表</h3>
      <el-button type="primary" size="large" @click="handleNewUserClick">新建用户</el-button>
    </div>
    <div class="dataShow">
      <div class="user-list-container">
        <!-- 数据表格 -->
        <el-table
            :data="userList"
            :loading="loading"
            border
            style="width: 100%">
          <el-table-column type="selection"/>
          <el-table-column type="index" label="序号" width="60"/>
          <el-table-column prop="id" label="ID" width="80" align="center"/>
          <el-table-column prop="username" label="用户名" width="120"/>
          <el-table-column prop="email" label="邮箱" width="200"/>
          <el-table-column label="角色" width="120" align="center">
            <template #default="{ row }">
              <component :is="'el-tag'" :type="roleConfig[row.role].type">
                {{ roleConfig[row.role].text }}
              </component>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status?'success':'danger'" effect="plain"> {{ row.status ? '正常' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="{row}">{{ formatUTC(row.createTime) }}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center">
            <template #default="{row}">{{ formatUTC(row.updateTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Edit" text @click="handleEditBtnClick(row)">编辑</el-button>
              <el-button type="danger" size="small" icon="Delete" text @click="handleDeleteBtnClick(row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
      </div>
      <div class="page">
        <el-pagination
            class="pagination mt-4"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :size="paginationSize"
            :disabled="paginationDisabled"
            :background="paginationBackground"
            layout="total, prev, pager, next, jumper"
            @update:current-page="onPageChange"
            :pager-count="11"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 30px;
}

.table {
  height: 400px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
}

.user-list-container {
  display: flex;
}

:deep(.el-table) .el-table__cell {
  padding: 12px 5px;
}

.el-button--small {
  padding: 5px 8px;
}

.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.pagination {
  margin-right: 20px;
}
</style>