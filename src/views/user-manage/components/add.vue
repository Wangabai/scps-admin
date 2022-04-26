<!--
 * @Author: 王鑫
 * @Description: 新增学生
 * @Date: 2022-04-19 15:31:13
-->
<template>
  <el-dialog :title="props.title" :model-value="props.isShow" width="400px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限">
        <el-checkbox-group v-model="formData.roles">
          <el-checkbox label="order">订单列表</el-checkbox>
        </el-checkbox-group>
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
import { reactive, Ref, ref, watch } from 'vue'
import type { ElForm } from 'element-plus'
import { addUser, updateUser } from '@/api/user'
import { ElMessage } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()

interface formDataInterface {
  id: string
  name: string
  roles: Array<string>
  password: string
}

const rules = ref({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const formData: formDataInterface = reactive({
  id: '',
  name: '',
  roles: [],
  password: ''
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
watch(
  () => props.data,
  (val) => {
    if (props.title === '编辑用户') {
      formData.id = val.id
      formData.name = val.name
      formData.roles = val.roles.split(',')
      formData.password = val.password
    }
  },
  {
    immediate: true
  }
)

// 取消 关闭弹窗
const close = () => {
  formData.id = ''
  formData.name = ''
  formData.roles = []
  formData.password = ''
  emit('close')
}

// 确认 新增编辑
const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, val: any) => {
    if (valid) {
      const order = formData.roles.indexOf('order') !== -1
      if (props.title === '新增用户') {
        const params = {
          password: formData.password,
          name: formData.name,
          roles: order ? 'order,placeorder,student,product' : 'placeorder,student,product'
        }
        const { code } = await addUser(params)
        if (code === 200) {
          ElMessage.success('新增成功')
          close()
        }
      } else {
        const params = {
          id: formData.id,
          password: formData.password,
          roles: order ? 'order,placeorder,student,product' : 'placeorder,student,product'
        }
        const { code } = await updateUser(params)
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
