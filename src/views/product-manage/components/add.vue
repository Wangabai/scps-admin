<!--
 * @Author: 王鑫
 * @Description: 新增产品
 * @Date: 2022-04-19 15:31:13
-->
<template>
  <el-dialog :title="props.title" :model-value="props.isShow" width="500px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" class="add-dialog">
      <div class="flex">
        <div class="add-item">
          <el-form-item label="产品编码" prop="id">
            <el-input v-model="formData.id" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="formData.productName" />
          </el-form-item>
          <el-form-item label="产品价格（元）" prop="price">
            <el-input-number :precision="2" v-model="formData.price" />
          </el-form-item>
          <el-form-item label="产品库存" prop="inventory">
            <el-input-number v-model="formData.inventory" :disabled="disabled" />
          </el-form-item>
        </div>
        <!-- <div class="btn">
          <el-icon
            :size="18"
            color="#7F88A4"
            style="margin-top: 2.5em"
            v-show="formData.list.length === 0 && showAdd"
          >
            <circle-plus @click="addLine" />
          </el-icon>
        </div> -->
      </div>

      <!-- <div class="add-list" v-for="(item, index) in formData.list" :key="index">
        <div class="flex">
          <div class="add-list-item">
            <el-form-item
              label="产品编码"
              :prop="'list.' + index + '.id'"
              :rules="rules.id"
              @change="scanEnter"
            >
              <el-input v-model="item.id"></el-input>
            </el-form-item>
            <el-form-item
              label="产品名称"
              :prop="'list.' + index + '.productName'"
              :rules="rules.productName"
            >
              <el-input v-model="item.productName"></el-input>
            </el-form-item>
            <el-form-item label="产品价格" :prop="'list.' + index + '.price'" :rules="rules.price">
              <el-input-number :precision="2" v-model="item.price"></el-input-number>
            </el-form-item>
            <el-form-item
              label="产品库存"
              :prop="'list.' + index + '.inventory'"
              :rules="rules.inventory"
            >
              <el-input-number v-model="item.inventory"></el-input-number>
            </el-form-item>
          </div>
          <div class="btn">
            <el-icon :size="18" color="#7F88A4" v-if="index >= 0" style="margin-right: 10px">
              <remove @click="delLine(index)" />
            </el-icon>
            <el-icon
              :size="18"
              color="#7F88A4"
              v-if="index === formData.list.length - 1"
            >
              <circle-plus @click="addLine" />
            </el-icon>
          </div>
        </div>
      </div> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="sure(formRef)">确 定</el-button>
      </span>
    </template></el-dialog
  >
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { ElForm } from 'element-plus'
import { productAdd, productUpdate, productAddList } from '@/api/product'
import { ElMessage } from 'element-plus'
import { CirclePlus, Remove } from '@element-plus/icons'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const rules = ref({
  inventory: [{ required: true, message: '请输入产品库存', trigger: 'blur' }],
  id: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
  price: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
})

interface formDataInterface {
  id: string
  inventory: number
  price: number
  productName: string
  list: Array<any>
}

const formData: formDataInterface = reactive({
  id: '',
  inventory: 0,
  price: 0,
  productName: '',
  list: []
})

const props = defineProps({
  title: {
    type: String,
    default: '新增产品'
  },
  isShow: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {}
  }
})

// 监听是否编辑
const showAdd = ref(true)
const disabled = ref(false)
watch(
  () => props.data,
  (val) => {
    if (val && props.title === '编辑产品') {
      showAdd.value = false
      disabled.value = true
      formData.id = val.id
      formData.inventory = val.inventory
      formData.price = val.price
      formData.productName = val.productName
    }
  },
  {
    immediate: true
  }
)

// 扫码
const scanEnter = () => {
  console.log('扫码')
}

const emit = defineEmits(['close'])

// 增减产品
// const delLine = (index: number) => {
//   formData.list.splice(index, 1)
// }
// const addLine = () => {
//   const item = {
//     id: '',
//     inventory: 0,
//     price: 0,
//     productName: ''
//   }
//   formData.list.push(item)
// }

// 取消 关闭弹窗
const close = () => {
  formData.id = ''
  formData.inventory = 0
  formData.price = 0
  formData.productName = ''
  formData.list = []
  showAdd.value = true
  disabled.value = false
  emit('close')
}

// 确定 新增编辑产品
const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, val: any) => {
    if (valid) {
      if (props.title === '新增产品') {
        if (formData.list.length > 0) {
          const item = {
            id: formData.id,
            inventory: formData.inventory,
            price: formData.price,
            productName: formData.productName
          }
          const productList = [item, ...formData.list]
          const { code } = await productAddList(productList)
          if (code === 200) {
            ElMessage.success('新增成功')
            close()
          }
        } else {
          const pramas = {
            id: formData.id,
            inventory: formData.inventory,
            price: formData.price,
            productName: formData.productName
          }
          const { code } = await productAdd(pramas)
          if (code === 200) {
            ElMessage.success('新增成功')
            close()
          }
        }
      } else {
        const pramas = {
          id: formData.id,
          inventory: formData.inventory,
          price: formData.price,
          productName: formData.productName
        }
        const { code } = await productUpdate(pramas)
        if (code === 200) {
          ElMessage.success('编辑成功')
          close()
        }
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.add-dialog {
  max-height: 400px;
  overflow: auto;
  .btn {
    margin-left: 10px;
  }
}
.flex {
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.el-form-item::v-deep {
  width: 390px;
  .el-input-number {
    width: 310px;
  }
}
</style>
