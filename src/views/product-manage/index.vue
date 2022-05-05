<!--
 * @Author: 王鑫
 * @Description: 产品列表
 * @Date: 2022-04-07 17:14:58
-->
<template>
  <page-title>
    <template v-slot:right>
      <el-button type="primary" size="small" @click="addEdit(1)">新增产品</el-button>
    </template>
  </page-title>
  <div class="search-box">
    <input-comp
      :isShowIcon="true"
      title="搜索"
      placeholder="扫描产品编码搜索产品"
      :hval="productId"
      @blur="productIdBlur"
      @enter="productIdBlur"
      @clear="clearProductId"
    ></input-comp>
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
    <template v-slot:opration>
      <el-table-column label="操作" fixed="right" width="140">
        <template v-slot="{ row }">
          <div class="opration_row">
            <span @click="addNum(row)">添加库存</span>
            <!-- <span @click="goto(id)">详情</span> -->
            <span @click="addEdit(2, row)">编辑</span>
          </div>
        </template>
      </el-table-column>
    </template>
  </table-comp>
  <Add :title="title" :isShow="isShow" :data="editData" @close="close"></Add>
  <AddNum :isShow="addShow" :name="productName" :id="addId" @close="close"></AddNum>
</template>

<script setup lang="ts">
import { productQuery, productDetail } from '@/api/product'
import { ref, onBeforeMount } from 'vue'
import Add from './components/add.vue'
import AddNum from './components/addNum.vue'

const productId = ref('')
const productIdBlur = async (val: string) => {
  productId.value = val
  if (val) {
    const { data, code } = await productDetail(val)
    if (code === 200) {
      tableData.value = data.products
      total.value = data.total
      pageCount.value = Math.ceil(total.value / pageSize.value)
    }
  } else {
    pageNum.value = 1
    getProductList()
  }
}

const clearProductId = () => {
  productId.value = ''
  pageNum.value = 1
  getProductList()
}

const theadName = [
  { prop: 'productName', label: '产品名称' },
  { prop: 'inventory', label: '库存' },
  { prop: 'price', label: '价格（元）' },
  { slot: 'opration' }
]
const tableData = ref([])
const total = ref(0)
const pageCount = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const getProductList = async () => {
  const parmas = {
    page: pageNum.value,
    size: pageSize.value
  }
  const { code, data } = await productQuery(parmas)
  if (code === 200) {
    tableData.value = data.products
    total.value = data.total
    pageCount.value = Math.ceil(total.value / pageSize.value)
  }
}
onBeforeMount(() => {
  getProductList()
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getProductList()
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val
  getProductList()
}

// 新增编辑产品
const isShow = ref(false)
const title = ref('新增产品')
const editData = ref({})

const addEdit = (rType: number, row?: any) => {
  if (rType === 1) {
    isShow.value = true
    title.value = '新增产品'
  } else if (rType === 2) {
    editData.value = row
    isShow.value = true
    title.value = '编辑产品'
  }
}

// 关闭弹窗
const close = () => {
  title.value = '新增产品'
  addId.value = ''
  editData.value = {}
  isShow.value = false
  addShow.value = false
  getProductList()
}

// 新增库存
const addShow = ref(false)
const addId = ref('')
const productName = ref('')
const addNum = (row: any) => {
  addShow.value = true
  addId.value = row.id
  productName.value = row.productName
}

// 跳转详情
// const router = useRouter()
</script>
<style lang="scss" scoped></style>
