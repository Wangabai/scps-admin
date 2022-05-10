<!--
 * @Author: 王鑫
 * @Description: 学生详情
 * @Date: 2022-04-21 13:57:38
-->
<template>
  <div class="detail">
    <el-drawer v-model="isShow" title="学生详情" @close="close" size="50%" class="detail">
      <el-form>
        <div class="flex">
          <el-form-item label="姓名:">{{ tableData.chineseName }}</el-form-item>
          <el-form-item label="首字母:" class="second-item">{{
            tableData.bopomofoName
          }}</el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="拼音:">{{ tableData.fullBopomofoName }}</el-form-item>
          <el-form-item label="手机号:" class="second-item">{{
            tableData.phoneNumber
          }}</el-form-item>
        </div>
        <el-form-item label="备注:">{{
          tableData.comment ? tableData.comment : '无'
        }}</el-form-item>
        <el-form-item label="订单">
          <el-table
            :data="tableData.orders"
            border
            height="400px"
            @selection-change="onSelectionChange"
          >
            <!-- <el-table-column label="全选" type="selection" :selectable="selectable" width="55" /> -->
            <el-table-column prop="id" label="产品号" />
            <el-table-column prop="creationDate" label="下单时间">
              <template #default="scope">
                {{ dayjs(scope.row.creationDate).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="付款">
              <template #default="scope">
                {{ scope.row.complete === 0 ? '未付款' : '已付款' }}
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价（元）" />
            <el-table-column label="付款">
              <template #default="scope">
                <div class="opration_row">
                  <span @click="detail(scope.row.id)">详情</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="总计未付款:">{{ noPaySum }}元</el-form-item>
      </el-form>
      <el-button type="primary" @click="payOrder" :disabled="tableData.orders.length === 0"
        >付款</el-button
      >
    </el-drawer>
    <OrderDetail :id="orderId" :isShow="orderShow" @close="orderClose"></OrderDetail>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { studentDetail } from '@/api/student'
import { pay } from '@/api/order'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderDetail from '@/views/components/orderDetail.vue'

// 传参
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

// 详情数据
const tableData = ref({
  bopomofoName: '',
  chineseName: '',
  comment: '',
  fullBopomofoName: '',
  orders: [],
  phoneNumber: ''
})

// 总计未付款金额
const noPaySum = ref(0)

// 监听是否传过来id
watch(
  () => props.id,
  (val) => {
    if (props.isShow) {
      getStudentDetail()
    }
  }
)

// 获取表单列表
const getStudentDetail = async () => {
  const { code, data } = await studentDetail(props.id)
  console.log(code)
  if (code === 200) tableData.value = data
  const order = tableData.value.orders
  if (order) {
    order.forEach((item: any) => {
      noPaySum.value += item.totalPrice
    })
  }
}

// 多选付款
const checkList = ref<string[]>()
const selectable = (val: any) => {
  return val.complete === 0
}
const onSelectionChange = (val: []) => {
  checkList.value = val.map((item: any) => {
    return item.id
  })
}

// 付款
const payOrder = async () => {
  try {
    await ElMessageBox.confirm('确认付款将无法更改，确认付款？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    checkList.value = tableData.value.orders.map((item: any) => {
      return item.id
    })
    const params = { orderIds: checkList.value }
    const { code } = await pay(params)
    if (code === 200) {
      ElMessage.success('付款成功')
      close()
    }
  } catch {
    ElMessage({
      type: 'info',
      message: '取消付款'
    })
  }
}

// 订单详情
const orderId = ref('')
const orderShow = ref(false)
const detail = (id: string) => {
  console.log('详情', id)
  orderId.value = id
  orderShow.value = true
}

const orderClose = () => {
  orderId.value = ''
  orderShow.value = false
  getStudentDetail()
}

// 关闭
const close = () => {
  tableData.value = {
    bopomofoName: '',
    chineseName: '',
    comment: '',
    fullBopomofoName: '',
    orders: [],
    phoneNumber: ''
  }
  noPaySum.value = 0
  checkList.value = []
  emit('close')
}
</script>
<style lang="scss" scoped>
.detail::v-deep {
  height: 100%;
  overflow: auto;
  .el-form-item {
    margin-bottom: 10px;
  }
}
.flex {
  display: flex;
}
.second-item {
  margin-left: 50px;
}
</style>
