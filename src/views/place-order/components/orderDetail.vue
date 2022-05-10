<!--
 * @Author: 王鑫
 * @Description: 
 * @Date: 2022-04-26 11:36:45
-->
<template>
  <el-form class="order">
    <div class="title">
      <el-form-item label="" style="text-align: center"><p>梓灿教育售货单</p></el-form-item>
    </div>

    <el-form-item label="订单号：">{{ orderData.id }}</el-form-item>
    <el-form-item label="下单时间："
      ><span style="font-size: 10px">{{ orderData.creationDate }}</span></el-form-item
    >
    <el-form-item label="学生姓名：">{{ orderData.student.chineseName }}</el-form-item>
    <el-form-item label="电话：">{{ orderData.student.phoneNumber }}</el-form-item>
    <el-form-item label="备注：">{{ orderData.student.comment }}</el-form-item>
    <el-form-item label="订单详情："> </el-form-item>
    <div class="order-item">
      <p v-for="(item, index) in orderData.items">
        {{
          index + 1 + '. ' + item.productName + ' [x' + item.quantity + '] ' + item.unitPrice + '元'
        }}
      </p>
    </div>
    <el-form-item label="总价">{{ orderData.totalPrice }}元</el-form-item>

    <div class="footer">
      <el-form-item label="" style="text-align: center"><p>__________________</p></el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface studentInterface {
  chineseName: string
  comment?: string
  phoneNumber: string
}

interface itemInterface {
  productName: string
  unitPrice: number
  quantity: number
  itemPrice: number
}

interface dataInterface {
  id: string
  creationDate: string
  student: studentInterface
  items: itemInterface[]
  totalPrice: number
}

interface Props {
  data: object
}

const props = withDefaults(defineProps<Props>(), {})

let orderData = reactive<dataInterface>({
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
})

watch(
  () => props.data,
  (val: any) => {
    orderData = val
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.order::v-deep {
  margin-bottom: 50px;
  padding: 10px 15px;
  width: 200px;
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
