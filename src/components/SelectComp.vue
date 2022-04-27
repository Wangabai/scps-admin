<!--
 * @Author: 王鑫
 * @Description: 下拉框组件
 * @Date: 2022-04-22 10:25:18
-->
<template>
  <div class="select-comp search-item">
    <div v-if="props.title" class="select-comp-title search-item__title">
      {{ props.title }}
    </div>
    <el-select
      v-model="value"
      class="select-comp-select"
      :multiple="props.multiple"
      collapse-tags
      :filterable="props.isfilterable"
      :clearable="props.clearable"
      :placeholder="props.placeholder"
      :size="props.size"
      :disabled="props.disabled"
      @change="valueChange"
      @input="valueInput"
      :isShowAll="props.isShowAll"
    >
      <el-option v-if="props.isShowAll" key="" value="" :label="props.allLabel"></el-option>
      <el-option
        v-for="item in props.data"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'

interface data {
  label: string
  value: string
}

interface Props {
  // 是否支持模糊查询
  isfilterable?: boolean
  multiple?: boolean
  disabled?: boolean
  isShowAll?: boolean
  // 全部项的显示名称
  allLabel?: string
  // 传入数据
  data?: data[]
  // 标题
  title?: string
  // 是否可以清空
  clearable?: boolean
  // 传入值
  hval?: string | number | []
  // 占位符
  placeholder?: string
  // 尺寸
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  isfilterable: false,
  multiple: false,
  disabled: false,
  isShowAll: false,
  clearable: false,
  allLabel: '全部'
})

const emit = defineEmits(['valueChange', 'valueInput'])

const value = ref<string | number | []>()

watch(
  () => props.hval,
  (val) => {
    value.value = val
  },
  { immediate: true }
)

const valueChange = () => {
  emit('valueChange', value.value)
}
const valueInput = () => {
  emit('valueInput', value.value)
}
</script>
<style lang="scss" scoped>
.select-comp {
  color: #354268;
}
</style>
