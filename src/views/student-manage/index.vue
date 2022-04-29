<!--
 * @Author: 王鑫
 * @Description: 博客列表
 * @Date: 2022-04-07 17:14:58
-->
<template>
  <page-title>
    <template v-slot:right>
      <el-button type="primary" size="small" @click="addEdit(1)">新增学生</el-button>
    </template>
  </page-title>
  <div class="search-box">
    <input-comp
      :isShowIcon="true"
      title="搜索"
      placeholder="输入学生姓名或手机号"
      :hval="studentName"
      @blur="studentNameBlur"
      @enter="studentNameBlur"
      @clear="clearstudentName"
    ></input-comp>
    <!-- <input-comp
      :isShowIcon="true"
      title="手机"
      placeholder="输入学生手机号搜索学生"
      :hval="phoneNumber"
      @blur="phoneNumberBlur"
      @enter="phoneNumberBlur"
      @clear="clearphoneNumber"
    ></input-comp> -->
  </div>
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
            <span @click="detail(row.id)">详情</span>
            <span @click="addEdit(2, row)">编辑</span>
          </div>
        </template>
      </el-table-column>
    </template>
  </table-comp>
  <Add :title="title" :isShow="isShow" :data="editData" @close="close"></Add>
  <Detail :isShow="detailShow" :id="detailId" @close="close"></Detail>
</template>

<script setup lang="ts">
import { studentQuery } from '@/api/student'
import { ref, onBeforeMount } from 'vue'
import Detail from './components/detail.vue'
import Add from './components/add.vue'

// 搜索框 拼音
const studentName = ref('')
const studentNameBlur = (val: string) => {
  pageNum.value = 1
  studentName.value = val
  getStudentList()
}
const clearstudentName = () => {
  pageNum.value = 1
  studentName.value = ''
  getStudentList()
}

// 搜索框 姓名
// const phoneNumber = ref('')
// const phoneNumberBlur = (val: string) => {
//   pageNum.value = 1
//   phoneNumber.value = val
//   getStudentList()
// }
// const clearphoneNumber = () => {
//   pageNum.value = 1
//   phoneNumber.value = ''
//   getStudentList()
// }

// 表头
const theadName = [
  { prop: 'chineseName', label: '学生姓名' },
  { prop: 'phoneNumber', label: '手机号码' },
  { prop: 'comment', label: '备注' }, // 备注
  { slot: 'opration' }
]

// 表格数据
const tableData = ref([])

// 获取表格数据
const total = ref(0)
const pageCount = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const getStudentList = async () => {
  const parmas = {
    filter: studentName.value,
    // phoneNumber: phoneNumber.value,
    page: pageNum.value,
    size: pageSize.value
  }
  const { code, data } = await studentQuery(parmas)
  if (code === 200) {
    tableData.value = data.students
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
    title.value = '新增学生'
  } else if (rType === 2) {
    isShow.value = true
    editData.value = val
    title.value = '编辑学生'
  }
}

// 详情
const detailShow = ref(false)
const detailId = ref('')
const detail = (id: string) => {
  detailShow.value = true
  detailId.value = id.toString()
}

// 关闭弹窗
const close = () => {
  detailShow.value = false
  detailId.value = ''
  isShow.value = false
  getStudentList()
}
</script>
<style lang="scss" scoped></style>
