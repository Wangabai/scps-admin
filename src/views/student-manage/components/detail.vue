<!--
 * @Author: 王鑫
 * @Description: 学生详情
 * @Date: 2022-04-21 13:57:38
-->
<template>
  <el-drawer v-model="isShow" title="学生详情" @close="close" size="50%">
    <el-form>
      <div class="flex">
        <el-form-item label="姓名">{{ tableData.chineseName }}</el-form-item>
        <el-form-item label="首字母" class="second-item">{{ tableData.bopomofoName }}</el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="拼音">{{ tableData.fullBopomofoName }}</el-form-item>
        <el-form-item label="手机号" class="second-item">{{ tableData.phoneNumber }}</el-form-item>
      </div>
      <el-form-item label="备注">{{ tableData.comment }}</el-form-item>
      <el-form-item label="订单">
        <el-table :data="tableData.orders" border height="400px">
          <el-table-column prop="id" label="产品号" />
          <el-table-column prop="creationDate" label="下单时间">
            <template #default="scope">
              {{ scope.row.creationDate.replace('T', ' ') }}
            </template>
          </el-table-column>
          <el-table-column label="付款">
            <template #default="scope">
              {{ scope.row.complete === 0 ? '未付款' : '已付款' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价（元）" />
        </el-table>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="pay">付款</el-button>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { studentDetail } from '@/api/student'

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
  orders: '',
  phoneNumber: ''
})

// 监听是否传过来id
watch(
  () => props.id,
  async (val) => {
    if (props.isShow) {
      const { code, data } = await studentDetail(props.id)
      if (code === 200) tableData.value = data
    }
  }
)
const pay = () => {
  console.log('付款')
}

// 关闭
const close = () => {
  tableData.value = {
    bopomofoName: '',
    chineseName: '',
    comment: '',
    fullBopomofoName: '',
    orders: '',
    phoneNumber: ''
  }
  emit('close')
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.second-item{
  margin-left: 50px;
}
</style>
