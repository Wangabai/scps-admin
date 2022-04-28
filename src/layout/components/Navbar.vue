<!--
 * @Author: 王鑫
 * @Description: 头部组件
 * @Date: 2022-03-25 16:39:22
-->
<template>
  <div class="navbar">
    <!-- 汉堡按钮 -->
    <Hamburger class="hamburger-container"></Hamburger>
    <div class="right-menu">
      <!-- 退出登陆 -->
      <el-button type="text" @click="logout">退出登陆</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {} from 'vue'
const store = useStore()
const router = useRouter()
const logout = () => {
  store
    .dispatch('user/logout')
    .then(() => {
      ElMessage.success('退出成功')
    })
    .finally(() => {
      router.push('/login')
    })
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 64px;
    height: 100%;
    float: left;
    cursor: pointer;

    // hover 动画
    transition: background 0.5s;
    -webkit-tap-highlight-color: transparent;
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    padding-right: 16px;
    height: 64px;
  }
}
</style>
