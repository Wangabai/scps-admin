<template>
  <el-dialog
    title="打印"
    :model-value="props.isShow"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form class="order">
      <div class="print" id="order">
        <div class="title">
          <el-form-item label="" style="text-align: center"><p>梓灿教育售货单</p></el-form-item>
        </div>
        <div v-for="(order, index) in orderData" :key="index" class="order-big-item">
          <el-form-item label="订单号：">{{ order.id }}</el-form-item>
          <el-form-item label="下单时间："
            ><span style="font-size: 10px">{{ order.creationDate }}</span></el-form-item
          >
          <el-form-item label="学生姓名：">{{ student.chineseName }}</el-form-item>
          <el-form-item label="电话：">{{ student.phoneNumber }}</el-form-item>
          <el-form-item label="备注：">{{ student.comment }}</el-form-item>
          <el-form-item label="订单详情："> </el-form-item>
          <div class="order-item">
            <p v-for="(item, index) in order.items">
              {{
                index +
                1 +
                '. ' +
                item.productName +
                ' [x' +
                item.quantity +
                '] ' +
                item.unitPrice +
                '元'
              }}
            </p>
          </div>
          <el-form-item label="总价：">{{ order.totalPrice }}元</el-form-item>
        </div>
        <div>
          <el-form-item label="订单总金额：">{{ allPrice }}元</el-form-item>
        </div>
        <div class="footer">
          <el-form-item label="" style="text-align: center"><p>__________________</p></el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-print="printObj">打 印</el-button>
      </span>
    </template></el-dialog
  >
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dataInterface } from '@/views/components/interface/orderItem'
import { studentDetail } from '@/api/student'
import dayjs from 'dayjs'

interface Props {
  isShow: boolean
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  isShow: false
})
const student = ref({
  chineseName: '',
  phoneNumber: '',
  comment: ''
})
const orderData = ref<dataInterface[]>([])

// 订单总金额
const allPrice = ref<number>(0)

watch(
  () => props.isShow,
  async (val: boolean) => {
    if (val && props.id) {
      const { code, data } = await studentDetail(props.id)
      if (code === 200) {
        allPrice.value = 0
        const studentData = data
        studentData.orders.forEach((item: any) => {
          item.creationDate = dayjs(item.creationDate.creationDate).format('YYYY-MM-DD HH:mm:ss')
          allPrice.value += item.totalPrice
        })
        orderData.value = studentData.orders
        student.value.chineseName = studentData.chineseName
        student.value.phoneNumber = studentData.phoneNumber
        student.value.comment = studentData.comment
      }
    }
  },
  {
    immediate: true
  }
)

const emit = defineEmits(['close'])

// 关闭
const close = () => {
  allPrice.value = 0
  orderData.value = []
  emit('close')
}

// 打印数据
const printObj = {
  // 打印区域
  id: 'order',
  // 打印标题
  popTitle: '梓灿教育售货单'
}
</script>
<style lang="scss" scoped>
.order::v-deep {
  max-height: 400px;
  overflow: auto;
  .print {
    margin-bottom: 50px;
    padding: 10px 15px;
    .order-big-item {
      border-bottom: 2px dashed #000;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .el-form-item {
      align-items: center;
      line-height: 20px;
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 20px;
      }
      .el-form-item__content {
        line-height: 20px;
      }
    }
    .order-item {
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 10px 0;
    }
    .title {
      text-align: center;
      margin-bottom: 15px;
    }
    .footer {
      text-align: center;
      margin-top: 100px;
    }
  }
}
</style>
