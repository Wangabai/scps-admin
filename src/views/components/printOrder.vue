<template>
  <el-dialog title="打印" :model-value="props.isShow" width="400px">
    <el-form class="order" id="order">
      <div class="title">
        <el-form-item label="" style="text-align: center"><p>梓灿教育售货单</p></el-form-item>
      </div>

      <el-form-item label="订单号：">{{ orderData.id }}</el-form-item>
      <el-form-item label="下单时间："
        ><span style="font-size: 10px">{{ orderData.creationDate }}</span></el-form-item
      >
      <el-form-item label="学生姓名：">{{ student.chineseName }}</el-form-item>
      <el-form-item label="电话：">{{ student.phoneNumber }}</el-form-item>
      <el-form-item label="备注：">{{ student.comment }}</el-form-item>
      <el-form-item label="订单详情："> </el-form-item>
      <div class="order-item">
        <p v-for="(item, index) in orderData?.items">
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
      <el-form-item label="总价">{{ orderData.totalPrice }}元</el-form-item>

      <div class="footer">
        <el-form-item label="" style="text-align: center"><p>__________________</p></el-form-item>
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
import { dataInterface } from './interface/orderItem'
import { orderDetail } from '@/api/order'
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
const orderData = ref<dataInterface>({
  id: '',
  creationDate: '',
  items: [
    {
      productName: '',
      unitPrice: 0,
      quantity: 0,
      itemPrice: 0
    }
  ],
  totalPrice: 0
})

watch(
  () => props.isShow,
  async (val: boolean) => {
    if (val && props.id) {
      const { code, data } = await orderDetail(props.id)
      if (code === 200) {
        const order = data
        order.creationDate = dayjs(order.creationDate).format('YYYY-MM-DD HH:mm:ss')
        orderData.value = order
        student.value = order.student
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
  orderData.value = {
    id: '',
    creationDate: '',
    student: {
      chineseName: '',
      comment: '',
      phoneNumber: ''
    },
    items: [
      {
        productName: '',
        unitPrice: 0,
        quantity: 0,
        itemPrice: 0
      }
    ],
    totalPrice: 0
  }
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
  max-height: 500px;
  overflow: auto;
  margin-bottom: 50px;
  padding: 10px 15px;
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
</style>
