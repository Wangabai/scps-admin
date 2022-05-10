<template>
  <div class="order-detail">
    <el-drawer v-model="isShow" title="订单详情" @close="close" size="50%">
      <table-comp
        :data="tableData"
        :col-configs="theadName"
        :isShowCheckBox="false"
        style="margin-bottom: 10px"
      />
      <el-button v-if="showPay" type="primary" @click="payOrder">付款</el-button>
      <el-button type="primary" @click="showPrint">打印</el-button>
    </el-drawer>
    <PrintOrder :isShow="payShow" :id="printId" @close="printClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { orderDetail, pay } from '@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import PrintOrder from './printOrder.vue'
import { dataInterface } from './interface/orderItem'

interface Props {
  isShow: boolean
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  isShow: false
})

const tableData = ref([])

const theadName = [
  { prop: 'productId', label: '产品编号' },
  { prop: 'productName', label: '产品名称' },
  { prop: 'unitPrice', label: '单价' },
  { prop: 'quantity', label: '数量' },
  { prop: 'itemPrice', label: '总价' }
]

// 监听是否传过来id
const showPay = ref(true)
watch(
  () => props.isShow,
  async (val) => {
    if (val) {
      const id = props.id + ''
      const { code, data } = await orderDetail(id)
      if (code === 200) {
        showPay.value = data.complete === 0 ? true : false
        tableData.value = data.items
      }
    }
  }
)

const emit = defineEmits(['close'])

// 付款
const payOrder = async () => {
  try {
    await ElMessageBox.confirm('确认付款将无法更改，确认付款？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const params = { orderIds: [props.id] }
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

// 关闭
const close = () => {
  tableData.value = []
  emit('close')
}

// 打印
const payShow = ref(false)
const printId = ref('')
let printData = reactive<dataInterface>({})
const showPrint = () => {
  printId.value = props.id
  payShow.value = true
}
const printClose = () => {
  payShow.value = false
  printId.value = ''
}
</script>
<style lang="scss" scoped></style>
