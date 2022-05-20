<!--
 * @Description: 时间筛选组件
-->
<template>
  <div class="time-picker search-item">
    <div class="time-picker-title search-item__title">{{ title }}</div>
    <el-date-picker
      v-model="value"
      :type="type"
      :format="format"
      unlink-panels
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :size="size"
      :clearable="clearable"
      @change="change"
      @blur="blur"
      @focus="focus"
    ></el-date-picker>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

interface Props {
  // 是否支持模糊查询
  isfilterable?: boolean
  // 传入数据
  data?: []
  // 标题
  title?: string
  type?: string
  format?: string
  // 传入数据
  hval?: []
  // 尺寸
  size?: string
  // 是否显示清空按钮
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isfilterable: true,
  type: 'daterange',
  format: 'YYYY-MM-DD',
  size: 'medium',
  clearable: true
})

const emit = defineEmits(['change', 'blur', 'focus'])

const value = ref<string[]>()

watch(
  () => props.hval,
  (val) => {
    value.value = val
  },
  { immediate: true }
)

const change = () => {
  if (value.value) {
    emit('change', {
      startTime: dayjs(value.value[0]).format('YYYY-MM-DD'),
      endTime: dayjs(value.value[1]).format('YYYY-MM-DD')
    })
  } else {
    emit('change', { startTime: '', endTime: '' })
  }
}

const blur = () => {
  if (value.value) {
    emit('blur', {
      startTime: dayjs(value.value[0]).format('YYYY-MM-DD'),
      endTime: dayjs(value.value[1]).format('YYYY-MM-DD')
    })
  } else {
    emit('blur', { startTime: '', endTime: '' })
  }
}

const focus = () => {
  if (value.value) {
    emit('focus', {
      startTime: dayjs(value.value[0]).format('YYYY-MM-DD'),
      endTime: dayjs(value.value[1]).format('YYYY-MM-DD')
    })
  } else {
    emit('focus', { startTime: '', endTime: '' })
  }
}
</script>
<style lang="scss" scoped>
.time-picker {
  .el-date-editor--daterange {
    width: 255px;
  }
}
</style>
