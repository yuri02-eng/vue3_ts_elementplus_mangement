<script lang="ts" setup>
import {computed, ref, reactive} from 'vue'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

interface User {
  date: string
  name: string
  address: string
}

const form = reactive({
  name: '',
  date: '',
  address: ''
})
const currentIndex = ref(-1)
const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const aoe_title= ref('编辑信息')
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}
const handleClose=()=>{
  form.name = ''
  form.date = ''
  form.address = ''
  dialogFormVisible.value = false
}
const dialogForm = (index: number, row: User) => {
  currentIndex.value = index
  for (let key in row) {
    if (form.hasOwnProperty(key)) {
      form[key] = row[key];
    }
  }
  dialogFormVisible.value = true
}
const dialogFormFirm = (index: number) => {
  if (IsAdd == true) {
    tableData.push({...form})
    console.log(form)
  }
  else {
    console.log(form)
    tableData[index] = {...form};
    // 关闭对话框
    console.log(tableData[index])
    currentIndex.value = -1
  }
  form.name = ''
  form.date = ''
  form.address = ''
  aoe_title.value="编辑信息"
  IsAdd=false
  dialogFormVisible.value = false
}
const dialogFormClose=()=>{
  form.name = ''
  form.date = ''
  form.address = ''
  aoe_title.value="编辑信息"
  IsAdd=false
  dialogFormVisible.value = false
}

const tableData: User[] = reactive([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
let IsAdd = false
const handleAdd = () => {
  dialogFormVisible.value = true
  IsAdd = true
  aoe_title.value="添加信息"
}
</script>
<template>
  <div style="display:flex;justify-content: center ">
    <el-table :data="filterTableData" style="width: 80%" >
      <el-table-column label="Date" prop="date" width="120" class="text-left"></el-table-column>
      <el-table-column label="Name" prop="name" width="120" class="text-left"></el-table-column>
      <el-table-column label="Address" prop="address" />
      <el-table-column align="right"  width="900">
        <template #header>
          <el-row
              :gutter="4"
              type="flex"
              justify="end"
              class="items-center gap-x-2">
            <!-- 按钮列 -->
            <el-col :span="6">  <!-- 禁止按钮列收缩 -->
              <el-button
                  @click="handleAdd"
                  class="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
              >
                Add Data Item
              </el-button>
            </el-col>

            <!-- 输入框列 -->
            <el-col :span="6" class="text-left">  <!-- 增加输入框列占比 -->
              <el-input
                  v-model="search"
                  size="small"
                  placeholder="Type to search"
              />
            </el-col>
          </el-row>
        </template>

        <!-- 原有 cell 模板保持不变 -->
        <template #default="scope">
          <el-button size="small" type="success" @click="dialogForm(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="aoe_title" width="500" @closed="handleClose">
      <el-form :model="form">
        <el-form-item label="Promotion date" :label-width="formLabelWidth">
          <el-input v-model="form.date" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="Promotion address" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormClose()">Cancel</el-button>
          <el-button type="primary" @click="dialogFormFirm(currentIndex)">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
</style>