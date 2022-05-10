<template>
  <!--
  使用时 button 文字 直接在标签内
  -->
  <el-button
    :type="btnType"
    @click="click"
    :loading="loading"
    :plain="plain"
    :size="size"
    :round="round"
    :disabled="disabled"
  >
    <svg-icon v-if="icon" :icon-class="icon" class="icon" />
    <slot></slot>
    <svg-icon v-if="iconAfter" :icon-class="iconAfter" class="icon" />
  </el-button>
</template>
<script setup lang="ts">
interface Props {
  // 按钮类型 primary / success / warning / danger / info / text
  btnType?: string
  // 按钮上显示加载状态。
  loading?: boolean
  icon?: string
  iconAfter?: string
  size?: string
  plain?: boolean
  round?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  btnType: 'primary',
  loading: false,
  plain: false,
  round: false,
  disabled: false
})

const emit = defineEmits(['click'])
const click = () => {
  emit('click')
}
</script>
<style lang="scss" scoped>
.el-button {
  .icon {
    font-size: 16px;
    margin-right: 7px;
    vertical-align: text-bottom;
  }
}
</style>
