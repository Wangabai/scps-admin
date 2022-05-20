<template>
  <el-dialog
    title="打印"
    :model-value="props.isShow"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form class="order">
      <div id="order">
        <div class="title">
          <el-form-item label="" style="text-align: center"><p>梓灿教育售货单</p></el-form-item>
        </div>
        <table-comp :data="tableData" :col-configs="theadName" :isShowCheckBox="false">
          <template v-slot:chineseName>
            <el-table-column label="姓名" width="70">
              <template v-slot="{ row }">
                <span>{{ row.student.chineseName }}</span>
              </template>
            </el-table-column>
          </template>
        </table-comp>
        <el-form-item label="总金额" style="float: right; margin-top: 5px"
          >{{ sumPrice }}元</el-form-item
        >

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
interface printData {
  student?: {
    chineseName?: string
  }
  id?: string
  creationDate?: string
  totalPrice?: string
}

interface Props {
  isShow: boolean
  data: printData[]
}

const props = withDefaults(defineProps<Props>(), {
  isShow: false
})

const theadName = [
  { slot: 'chineseName' },
  { prop: 'id', label: '编号', width: 35 },
  { prop: 'creationDate', label: '下单时间', width: 160 },
  { prop: 'totalPrice', label: '金额', width: 35 }
]

const tableData = ref<printData[]>([])
const sumPrice = ref(0)
watch(
  () => props.isShow,
  async (val: boolean) => {
    if (val && props.data) {
      sumPrice.value = 0
      tableData.value = props.data
      tableData.value.forEach((item: any) => {
        sumPrice.value += item.totalPrice
      })
    }
  },
  {
    immediate: true
  }
)

const emit = defineEmits(['close'])

// 关闭
const close = () => {
  sumPrice.value = 0
  tableData.value = []
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
