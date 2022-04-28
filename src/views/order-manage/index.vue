<!--
 * @Author: 王鑫
 * @Description: 订单列表
 * @Date: 2022-04-07 17:14:58
-->
<template>
  <page-title> </page-title>
  <div class="search-box">
    <select-comp
      title="学生"
      :isfilterable="true"
      :hval="keyword"
      :data="studentList"
      @valueChange="keywordBlur"
    >
    </select-comp>
    <select-comp
      title="是否付款"
      :isShowAll="true"
      :hval="payValue"
      :data="options"
      @valueChange="payValueChange"
    >
    </select-comp>
    <time-picker
      :isShowIcon="true"
      title="下单时间"
      :hval="time"
      @change="dateChange"
    ></time-picker>
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
    <template v-slot:studentId>
      <el-table-column label="学生姓名">
        <template v-slot="{ row }">
          <span>{{ row.student.chineseName }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-slot:phoneNumber>
      <el-table-column label="手机号">
        <template v-slot="{ row }">
          <span>{{ row.student.phoneNumber }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-slot:completeDate>
      <el-table-column label="付款日期">
        <template v-slot="{ row }">
          <span>{{ row.completeDate ? row.completeDate : '暂未付款' }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-slot:complete>
      <el-table-column label="是否付款">
        <template v-slot="{ row }">
          <span>{{ row.complete === 0 ? '暂未付款' : '已付款' }}</span>
        </template>
      </el-table-column>
    </template>
  </table-comp>
</template>

<script setup lang="ts">
import { orderQuery } from '@/api/order'
import { ref, onBeforeMount, Ref } from 'vue'
import { studentQuery } from '@/api/student'
import dayjs from 'dayjs'

interface stduentListInterface {
  id?: string
  chineseName?: string
}

// 学生列表
const studentList: Ref<Array<stduentListInterface>> = ref([])
const getStudentList = async () => {
  const { data, code } = await studentQuery({ page: 1, size: 9999 })
  if (code === 200) {
    studentList.value = data.students.map((item: any) => {
      return {
        value: item.id,
        label: item.chineseName
      }
    })
  }
}

// 学生 select选择框
const keyword = ref<number>()
const keywordBlur = (val: number) => {
  pageNum.value = 1
  keyword.value = val
  getOrderList()
}

// 时间选择器
const time = ref<string[]>()
const startTime = ref()
const endTime = ref()
const dateChange = (val: any) => {
  startTime.value = val.startTime
  endTime.value = val.endTime
  time.value = [startTime.value, endTime.value]
  pageNum.value = 1
  getOrderList()
}

// 是否付款 select选择框
const payValue = ref<boolean | string | null>('')
const options = ref([
  {
    value: true,
    label: '已付款'
  },
  {
    value: false,
    label: '未付款'
  }
])
const payValueChange = (val: string) => {
  pageNum.value = 1
  payValue.value = val
  getOrderList()
}

const theadName = [
  { slot: 'studentId' },
  { slot: 'phoneNumber' },
  { slot: 'completeDate', label: '付款日期' },
  { prop: 'creationDate', label: '下单日期' },
  { slot: 'complete', label: '是否付款' },
  { prop: 'totalPrice', label: '总金额（元）' }
]
const tableData = ref([])
const total = ref(0)
const pageCount = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const getOrderList = async () => {
  const parmas = {
    page: pageNum.value,
    size: pageSize.value,
    studentId: keyword.value,
    paid: payValue.value,
    startDate: startTime.value ? startTime.value + ' 00:00:00' : '',
    endDate: endTime.value ? endTime.value + ' 23:59:59' : ''
  }
  const { code, data } = await orderQuery(parmas)
  if (code === 200) {
    const list = data.orders
    list.forEach((item: any) => {
      item.creationDate = dayjs(item.creationDate).format('YYYY-MM-DD HH:MM:ss')
      item.completeDate = item.completeDate
        ? dayjs(item.completeDate).format('YYYY-MM-DD HH:MM:ss')
        : item.completeDate
    })
    tableData.value = list
    total.value = data.total
    pageCount.value = Math.ceil(total.value / pageSize.value)
  }
}
onBeforeMount(() => {
  getStudentList()
  getOrderList()
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getOrderList()
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getOrderList()
}
</script>
<style lang="scss" scoped></style>
