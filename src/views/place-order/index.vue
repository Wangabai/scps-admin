<!--
 * @Author: 王鑫
 * @Description: 下单页面
 * @Date: 2022-04-25 11:14:13
-->
<template>
  <page-title currentTitle="新增订单"> </page-title>
  <el-form ref="formRef" @submit.enter.prevent  :model="formData" :rules="rules" label-width="80px" class="add-dialog">
    <el-steps :active="active" finish-status="success">
      <el-step title="选择学生"> </el-step>
      <el-step title="选择产品"> </el-step>
      <el-step title="打印订单"> </el-step>
    </el-steps>
    <div v-if="active === 0">
      <div class="flex">
        <el-form-item label="学生" prop="studentId">
          <el-select
            filterable
            remote
            clearable
            :remote-method="remoteMethod"
            :loading="loading"
            v-model="formData.studentId"
            placeholder="选择学生"
            @change="checkStudent"
          >
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生详情" v-if="formData.studentId" class="detail">
          <el-form label-width="100px" label-position="right">
            <el-form-item label="姓名">{{ studentDetail?.chineseName }}</el-form-item>
            <el-form-item label="首字母">{{ studentDetail?.bopomofoName }}</el-form-item>
            <el-form-item label="拼音">{{ studentDetail?.fullBopomofoName }}</el-form-item>
            <el-form-item label="手机号">{{ studentDetail?.phoneNumber }}</el-form-item>
            <el-form-item label="备注">{{
              studentDetail?.chineseName ? studentDetail?.chineseName : '无'
            }}</el-form-item>
          </el-form>
        </el-form-item>
      </div>
      <el-button style="margin-top: 12px" @click="next">下一步</el-button>
    </div>
    <div v-if="active === 1">
      <div class="flex">
        <div class="input-product-id">
          <el-form-item label="产品编码" prop="productId">
            <el-input v-model="productId" @change="scanEnter" ref="inputProduct" />
          </el-form-item>
          <el-form-item label="总价：" prop="productId">
            <span>{{ sumPrice }}元</span>
          </el-form-item>
        </div>
        <el-form-item label="产品详情" class="detail">
          <el-form label-width="100px" label-position="right">
            <div v-for="(item, index) in productList" :key="item.id" class="product-item">
              <div class="flex icon-center">
                <div>
                  <el-form-item label="产品名称：">{{ item.productName }}</el-form-item>
                  <el-form-item label="产品价格：">{{ item.price }}元</el-form-item>
                  <el-form-item label="数量：">
                    <el-input-number v-model="item.needNum" :min=1 @change="changeNum" />
                  </el-form-item>
                </div>
                <el-icon :size="18" color="#7F88A4" style="margin-right: 10px">
                  <remove @click="delLine(index)" />
                </el-icon>
              </div>
            </div>
          </el-form>
        </el-form-item>
      </div>
      <el-button @click="last">上一步</el-button>
      <el-button type="primary" @click="sure(formRef)">下 单</el-button>
    </div>
    <div v-if="active === 2">
      <order id="order" :data="orderData" />
      <div class="flex space">
        <el-button type="primary" v-print="printObj">打 印</el-button>
        <el-button type="danger" @click="reset" class="float:right">重 置</el-button>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, Ref } from 'vue'
import type { ElForm } from 'element-plus'
import { placeOrder } from '@/api/order'
import { studentQuery } from '@/api/student'
import { productDetail } from '@/api/product'
import { Remove } from '@element-plus/icons'
import order from './components/orderDetail.vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const rules = ref({
  studentId: [{ required: true, message: '请输入学生信息', trigger: 'blur' }]
})

interface productListInterface {
  id: string
  inventory: number
  price: number
  productName: string
  needNum: number
}

interface listInterface {
  productId: string
  quantity: number
}

interface formDataInterface {
  studentId: string
  items: Array<listInterface>
}

interface stduentListInterface {
  id?: string
  chineseName?: string
  label?: string
}

interface stduentDetailInterface {
  chineseName?: string
  bopomofoName?: string
  fullBopomofoName?: string
  phoneNumber?: string
  comment?: string
}

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

const formData: formDataInterface = reactive({
  studentId: '',
  items: []
})

// 学生列表
const studentList: Ref<Array<stduentListInterface>> = ref([])
const getStudentList = async (query: string) => {
  const { data, code } = await studentQuery({ page: 1, size: 10, filter: query })
  if (code === 200) {
    const list = data.students
    list.forEach((item: any) => {
      item.label = item.comment
        ? `${item.chineseName}:${item.phoneNumber}(${item.comment})`
        : `${item.chineseName}:${item.phoneNumber}`
    })
    studentList.value = list
  }
}

// 远程搜索学生
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

// 选择学生展示学生详情
const studentDetail = ref<stduentDetailInterface>()
const checkStudent = (val: string) => {
  const detail = studentList.value.find((item: any) => {
    return item.id === val
  })
  if (detail) {
    studentDetail.value = detail
  }
}

// 扫码产品总价
const sumPrice = ref<number>(0)

// 扫码 展示产品信息
const productId = ref()
const productList: Ref<Array<productListInterface>> = ref([])
const scanEnter = async () => {
  const { data, code } = await productDetail(productId.value)
  if (code === 200) {
    const fistItem = productList.value.find((item) => item.id === data.products[0].id)
    if (fistItem) {
      const index = productList.value.indexOf(fistItem)
      productList.value[index].needNum++
    } else {
      const item = {
        id: data.products[0].id,
        productName: data.products[0].productName,
        price: data.products[0].price,
        inventory: data.products[0].inventory,
        needNum: 1
      }
      productList.value.push(item)
    }
  }
  sumPrice.value = 0
  productList.value.forEach((item: any) => {
    sumPrice.value += item.price * item.needNum
  })
  productId.value = ''
}

// 更改产品数量
const changeNum = () => {
  sumPrice.value = 0
  productList.value.forEach((item: any) => {
    sumPrice.value += item.price * item.needNum
  })
}

// 步奏条
const active = ref(0)
// 下一步
const next = () => {
  if (!formData.studentId) {
    ElMessage.error('请选择学生')
    return
  }
  if (active.value !== 0) return
  active.value++
}
// 上一步
const last = () => {
  if (active.value !== 1) return
  active.value--
}

// 删除产品
const delLine = (index: number) => {
  productList.value.splice(index, 1)
}

// 打印数据
const isShow = ref(false)
const orderData = ref({})
const printObj = {
  // 打印区域
  id: 'order',
  // 打印标题
  popTitle: '梓灿教育售货单'
}

// 确定 新增编辑产品
const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  for (let i = 0; i < productList.value.length; i++) {
    const item = {
      productId: productList.value[i].id,
      quantity: productList.value[i].needNum
    }
    formData.items.push(item)
  }
  if (!formData.studentId) {
    ElMessage.error('请选择学生')
    return
  }
  if (formData.items.length === 0) {
    ElMessage.error('请添加产品')
    return
  }
  await formEl.validate(async (valid: any, val: any) => {
    if (valid) {
      const { code, data } = await placeOrder(formData)
      if (active.value !== 1) return
      if (code === 200) {
        ElMessage.success('新增成功')
        isShow.value = true
        const order = data
        ;(order.creationDate = dayjs(order.creationDate).format('YYYY-MM-DD HH:mm:ss')),
          (orderData.value = order)
        active.value++
      }
    }
  })
}

// 重置表单 回到第一步
const reset = async () => {
  if (active.value !== 2) return
  try {
    await ElMessageBox.confirm('确认重置将无法打印当前订单，确认重置？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    active.value = 0
    formData.studentId = ''
    formData.items = []
    productList.value = []
    sumPrice.value = 0
  } catch {
    ElMessage({
      type: 'info',
      message: '取消重置'
    })
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.space {
  justify-content: space-between;
}
.icon-center {
  align-items: center;
}
.detail {
  margin-left: 50px;
}
.input-product-id {
  min-width: 40%;
}
.product-item {
  padding-bottom: 5px;
  border-bottom: 1px solid #000;
}
</style>
