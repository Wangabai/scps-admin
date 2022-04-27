<!--
 * @Author: 王鑫
 * @Description: 用户管理
 * @Date: 2022-04-21 13:51:05
-->
<template>
  <page-title>
    <template v-slot:right>
      <el-button type="primary" size="small" @click="addEdit(1)">新增用户</el-button>
    </template>
  </page-title>
  <table-comp
    :data="tableData"
    :col-configs="theadName"
    :isShowCheckBox="false"
    :total="total"
    :pageCount="pageCount"
    :currentPage="pageNum"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
  >
    <template v-slot:roles>
      <el-table-column label="权限" width="400">
        <template v-slot="{ row }">
          <span v-for="(item, index) in row.role" :key="index" class="role_span">{{
            role(item)
          }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-slot:opration>
      <el-table-column label="操作" fixed="right" width="140">
        <template v-slot="{ row }">
          <div class="opration_row">
            <span @click="addEdit(2, row)">编辑</span>
            <span @click="del(row.id)">删除</span>
          </div>
        </template>
      </el-table-column>
    </template>
  </table-comp>
  <Add :title="title" :isShow="isShow" :data="editData" @close="close"></Add>
</template>

<script setup lang="ts">
import { userList, delUser } from '@/api/user'
import { ref, onBeforeMount } from 'vue'
import Add from './components/add.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const theadName = [
  { prop: 'name', label: '登陆名' },
  { prop: 'password', label: '密码' }, // 备注 ｜ 课程
  { slot: 'roles' },
  { slot: 'opration' }
]
let tableData = ref([])
let total = ref(0)
let pageCount = ref(0)
let pageNum = ref(1)
let pageSize = ref(10)
const getStudentList = async () => {
  const parmas = {
    page: pageNum.value,
    size: pageSize.value
  }
  const { code, data } = await userList(parmas)
  if (code === 200) {
    const list = data.adminList
    list.forEach((item: any) => {
      item.role = item.roles.split(',')
    })
    tableData.value = list
    console.log(tableData.value)
    total.value = data.total
    pageCount.value = Math.ceil(total.value / pageSize.value)
  }
}
onBeforeMount(() => {
  getStudentList()
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getStudentList()
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getStudentList()
}

// 新增编辑用户
const isShow = ref(false)
const title = ref('新增用户')
const editData = ref({})

const addEdit = (rType: number, val?: any) => {
  if (rType === 1) {
    isShow.value = true
    title.value = '新增用户'
  } else if (rType === 2) {
    isShow.value = true
    editData.value = val
    title.value = '编辑用户'
  }
}

// 删除
const del = async (id: string) => {
  try {
    await ElMessageBox.confirm('删除用户无法恢复，是否删除', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const { code } = await delUser(id)
    if (code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功！'
      })
      getStudentList()
    }
  } catch {
    ElMessage({
      type: 'info',
      message: '取消删除'
    })
  }
}

// 关闭弹窗
const close = () => {
  isShow.value = false
  getStudentList()
}

// 筛选权限
const role = (val: string) => {
  switch (val) {
    case 'admin':
      return '用户管理'
    case 'student':
      return '学生管理'
    case 'product':
      return '产品管理'
    case 'order':
      return '订单管理'
    case 'placeorder':
      return '下单操作'
    case 'placeOrder':
      return '下单操作'
    default:
      break
  }
}
</script>
<style lang="scss" scoped>
.role_span {
  border: 1px solid #ccc;
  padding: 1px 4px;
  margin-right: 5px;
}
</style>
