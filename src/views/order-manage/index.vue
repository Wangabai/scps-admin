<!--
 * @Author: 王鑫
 * @Description: 订单列表
 * @Date: 2022-04-07 17:14:58
-->
<template>
  <page-title> </page-title>
  <div class="search-box">
    <input-comp
      :isShowIcon="true"
      title="学生"
      placeholder="搜索订单"
      :hval="keyword"
      @blur="keywordBlur"
      @enter="keywordBlur"
      @clear="clearKeyword"
    ></input-comp>
    <select-comp
      title="是否付款"
      :isShowAll="true"
      :hval="payValue"
      :data="options"
      @valueChange="payValueChange"
    >
    </select-comp>
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
    <template v-slot:completeDate>
      <el-table-column label="付款日期" fixed="right" width="140">
        <template v-slot="{ row }">
          <span>{{ row.completeDate ? row.completeDate : '暂未付款' }}</span>
        </template>
      </el-table-column>
    </template>
    <template v-slot:complete>
      <el-table-column label="是否付款" fixed="right" width="140">
        <template v-slot="{ row }">
          <span>{{ row.complete === 0 ? '暂未付款' : '已付款' }}</span>
        </template>
      </el-table-column>
    </template>
  </table-comp>
</template>

<script setup lang="ts">
import { orderQuery } from '@/api/order'
import { ref, onBeforeMount } from 'vue'

// 搜索框
const keyword = ref('')
const keywordBlur = (val: string) => {
  pageNum.value = 1
  keyword.value = val
  getOrderList()
}
const clearKeyword = () => {
  pageNum.value = 1
  keyword.value = ''
  getOrderList()
}

// 是否付款
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
const payValueChange = (val: boolean | string | null) => {
  console.log(val)
  pageNum.value = 1
  payValue.value = val
  getOrderList()
}

const theadName = [
  { slot: 'studentId', label: '学生姓名' },
  { slot: 'completeDate', label: '付款日期' },
  { prop: 'creationDate', label: '下单日期' },
  { slot: 'complete', label: '是否付款' }
  // { slot: 'opration' }
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
    unPaid: payValue.value
  }
  const { code, data } = await orderQuery(parmas)
  if (code === 200) {
    const list = data.orders
    list.forEach((item: any) => {
      item.creationDate = item.creationDate.replace('T', '')
      item.completeDate = item.completeDate ? item.creationDate.replace('T', '') : null
    })
    tableData.value = list
    total.value = data.total
    pageCount.value = Math.ceil(total.value / pageSize.value)
  }
}
onBeforeMount(() => {
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
