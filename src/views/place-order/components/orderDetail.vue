<!--
 * @Author: 王鑫
 * @Description: 
 * @Date: 2022-04-26 11:36:45
-->
<template>
  <el-form>
    <el-form-item label="订单号：">{{ orderData.id }}</el-form-item>
    <el-form-item label="下单时间：">{{ orderData.creationDate }}</el-form-item>
    <el-form-item label="学生姓名：">{{ orderData.student.chineseName }}</el-form-item>
    <el-form-item label="电话：">{{ orderData.student.phoneNumber }}</el-form-item>
    <el-form-item label="备注：">{{ orderData.student.comment }}</el-form-item>
    <el-form-item label="订单详情">
      <el-table :data="orderData.items" border>
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="unitPrice" label="单价（元）" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="itemPrice" label="单项总价（元）" />
      </el-table>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="总价">{{ orderData.totalPrice }}元</el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, Ref, ref, watch } from 'vue'

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
  items: itemInterface
  totalPrice: number
}

interface Props {
  data: dataInterface
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
  items: {
    productName: '',
    unitPrice: 0,
    quantity: 0,
    itemPrice: 0
  },
  totalPrice: 0
})

watch(
  () => props.data,
  (val) => {
    orderData = val
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.order-table {
  border: 1px solid #000;
}
</style>
