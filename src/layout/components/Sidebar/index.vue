<!--
 * @Author: 王鑫
 * @Description:
 * @Date: 2022-03-25 16:38:47
-->
<template>
  <div>
    <div class="logo-container">
      <h1 class="logo-title" v-if="$store.getters.sidebarOpened">梓灿教育售货系统</h1>
      <!-- <el-avatar
        :size="logoHeight"
        shape="square"
        src="@/assets/000.png"
        v-else
      /> -->
      <img src="~@/assets/000.png" alt="" class="sidebar-logo" v-else />
    </div>
    <el-scrollbar>
      <SidebarMenu></SidebarMenu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from './components/SidebarMenu.vue'
import {} from 'vue'
const logoHeight = 50
</script>
<style lang="scss" scoped>
.logo-container {
  height: v-bind(logoHeight) + 'px';
  padding: 7px 0 7px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-title {
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
  .sidebar-logo {
    width: 54px;
    margin-right: 0px;
  }
}
</style>
