<!--
 * @Author: 王鑫
 * @Description: 新增学生
 * @Date: 2022-04-19 15:31:13
-->
<template>
  <el-dialog :title="props.title" :model-value="props.isShow" width="400px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="60px">
      <el-form-item label="姓名">
        <el-input v-model="formData.chineseName" autocomplete="off" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.phoneNumber" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.classType" autocomplete="off" />
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
import { ref, watch } from 'vue'
import type { ElForm } from 'element-plus'
import { studentAdd, studentUpdate } from '@/api/student'
import { ElMessage } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const rules = ref({
  phoneNumber: [{ required: true, message: '请输入学生联系方式', trigger: 'blur' }],
  classType: [{ required: true, message: '请输入课程信息', trigger: 'blur' }],
  chineseName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }]
})
const formData = ref({
  id: '',
  phoneNumber: '',
  classType: '',
  chineseName: ''
})

const props = defineProps({
  title: {
    type: String,
    default: '新增学生'
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

const emit = defineEmits(['close'])

// 监听是否编辑
const disabled = ref(false)
watch(
  () => props.data,
  (val) => {
    if (props.title === '编辑学生') {
      disabled.value = true
      formData.value.id = val.id
      formData.value.phoneNumber = val.phoneNumber
      formData.value.classType = val.classType
      formData.value.chineseName = val.chineseName
    }
  },
  {
    immediate: true
  }
)

// 取消 关闭弹窗
const close = () => {
  formData.value.id = ''
  formData.value.phoneNumber = ''
  formData.value.classType = ''
  formData.value.chineseName = ''
  disabled.value = false
  emit('close')
}

// 确认 新增编辑
const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, val: any) => {
    if (valid) {
      if (props.title === '新增学生') {
        const params = {
          chineseName: formData.value.chineseName,
          phoneNumber: formData.value.phoneNumber,
          classType: formData.value.classType
        }
        const { code } = await studentAdd(params)
        if (code === 200) {
          ElMessage.success('新增成功')
          close()
        }
      } else {
        const params = {
          id: formData.value.id,
          chineseName: formData.value.chineseName,
          phoneNumber: formData.value.phoneNumber,
          classType: formData.value.classType
        }
        const { code } = await studentUpdate(params)
        if (code === 200) {
          ElMessage.success('编辑成功')
          close()
        }
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
