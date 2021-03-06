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
      :isFilterable="true"
      :isRemote="true"
      :clearable="true"
      :hval="keyword"
      :data="studentList"
      :loading="loading"
      @remoteMethod="remoteMethod"
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

    <btn-comp class="btn" size="medium" @click="selectData">查询</btn-comp>
    <btn-comp btnType="warning" class="btn" size="medium" plain @click="clear">重置</btn-comp>
  </div>
  <table-comp :data="tableData" :col-configs="theadName" :isShowCheckBox="false">
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
    <template v-slot:opration>
      <el-table-column label="操作" fixed="right" width="140">
        <template v-slot="{ row }">
          <div class="opration_row">
            <span @click="detail(row.id)">详情</span>
          </div>
        </template>
      </el-table-column>
    </template>
  </table-comp>
  <btn-comp class="btn" size="medium" @click="printOrder" style="margin-top: 5px"
    >打印订单</btn-comp
  >
  <span v-if="tableData.length > 0">{{ `列表总金额 ： ${allPrice}` }}元</span>

  <OrderDetail :id="orderId" :isShow="orderShow" @close="orderClose" />
  <PrintOrder :data="printData" :isShow="printShow" @close="orderClose" />
</template>

<script setup lang="ts">
import { orderQuery } from '@/api/order'
import { ref, Ref } from 'vue'
import { studentQuery } from '@/api/student'
import dayjs from 'dayjs'
import OrderDetail from '@/views/components/orderDetail.vue'
import PrintOrder from './components/printOrder.vue'
import { ElMessage } from 'element-plus'

interface stduentListInterface {
  id?: string
  chineseName?: string
}

interface printData {
  student?: {
    chineseName?: string
  }
  id?: string
  creationDate?: string
  totalPrice?: string
}

// 学生列表
const studentList: Ref<Array<stduentListInterface>> = ref([])
const getStudentList = async (query: string) => {
  const { data, code } = await studentQuery({ page: 1, size: 10, filter: query })
  if (code === 200) {
    studentList.value = data.students.map((item: any) => {
      return {
        value: item.id,
        label: item.comment
          ? `${item.chineseName}:${item.phoneNumber}(${item.comment})`
          : `${item.chineseName}:${item.phoneNumber}`
      }
    })
  }
}

// 远程搜索
const loading = ref(false)
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    await getStudentList(query)
    loading.value = false
  } else {
    studentList.value = []
  }
}

// 学生 select选择框
const keyword = ref<number | null>()
const keywordBlur = (val: number) => {
  pageNum.value = 1
  keyword.value = val
  // getOrderList()
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
  // getOrderList()
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
  // getOrderList()
}

const theadName = [
  { slot: 'studentId' },
  { slot: 'phoneNumber' },
  { prop: 'creationDate', label: '下单日期' },
  { slot: 'complete', label: '是否付款' },
  { slot: 'completeDate', label: '付款日期' },
  { prop: 'totalPrice', label: '总金额（元）' },
  { slot: 'opration' }
]
const tableData = ref([])
const total = ref(0)
const pageCount = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const allPrice = ref(0)
const getOrderList = async () => {
  const parmas = {
    page: 1,
    size: 9999,
    studentId: keyword.value,
    paid: payValue.value,
    startDate: startTime.value ? startTime.value + ' 00:00:00' : '',
    endDate: endTime.value ? endTime.value + ' 23:59:59' : ''
  }
  const { code, data } = await orderQuery(parmas)
  if (code === 200) {
    const list = data.orders
    allPrice.value = 0
    list.forEach((item: any) => {
      item.creationDate = dayjs(item.creationDate).format('YYYY-MM-DD HH:MM:ss')
      item.completeDate = item.completeDate
        ? dayjs(item.completeDate).format('YYYY-MM-DD HH:MM:ss')
        : item.completeDate
      allPrice.value += item.totalPrice
    })
    tableData.value = list
    total.value = data.total
    pageCount.value = Math.ceil(total.value / pageSize.value)
  }
}

// 查询订单
const selectData = () => {
  getOrderList()
}
// 清空筛选项
const clear = () => {
  keyword.value = null
  payValue.value = ''
  startTime.value = ''
  endTime.value = ''
  time.value = ['', '']
  tableData.value = []
  allPrice.value = 0
}

// 订单详情
const orderId = ref('')
const orderShow = ref(false)
const detail = (id: string) => {
  orderId.value = id
  orderShow.value = true
}

const orderClose = () => {
  orderId.value = ''
  orderShow.value = false
  printShow.value = false
  printData.value = []
}

// 打印订单
const printShow = ref(false)
const printData = ref<printData[]>([])
const printOrder = () => {
  if (tableData.value.length > 0) {
    printShow.value = true
    printData.value = tableData.value
  } else {
    ElMessage({
      type: 'warning',
      message: '没有订单'
    })
  }
}
</script>
<style lang="scss" scoped>
.btn {
  margin-right: 16px;
  margin-bottom: 10px;
}
</style>
