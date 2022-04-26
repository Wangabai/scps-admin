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
  { prop: 'roles', label: '角色权限' },
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
    tableData.value = data.adminList
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

// 新增博客
const isShow = ref(false)
const title = ref('新增学生')
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

// 详情
const del = (id: string) => {
  ElMessageBox.confirm('删除用户无法恢复，是否删除', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delUser(id).then((res) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功！'
          })
          getStudentList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 删除

// 关闭弹窗
const close = () => {
  isShow.value = false
  getStudentList()
}
</script>
<style lang="scss" scoped></style>
