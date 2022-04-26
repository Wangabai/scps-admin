<!--
 * @Author: 王鑫
 * @Description: 新增产品库存
 * @Date: 2022-04-21 09:34:12
-->
<template>
  <el-dialog title="新增库存" :model-value="props.isShow">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="产品名称">
        {{ props.name }}
      </el-form-item>
      <el-form-item label="产品库存">
        <el-input-number v-model="formData.addedInventory" />
      </el-form-item>
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
import { ref } from 'vue'
import type { ElForm } from 'element-plus'
import { productAddInventory } from '@/api/product'
import { ElMessage } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const rules = ref({
  inventory: [{ required: true, message: '请输入清单', trigger: 'blur' }],
  price: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
})
const formData = ref({
  addedInventory: 0
})

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
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

// 取消 关闭弹窗
const close = () => {
  formData.value.addedInventory = 0
  emit('close')
}

const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, val: any) => {
    if (valid) {
      const pramas = {
        productId: props.id,
        addedInventory: formData.value.addedInventory
      }
      const { code } = await productAddInventory(pramas)
      if (code === 200) {
        ElMessage.success('新增成功')
        close()
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
