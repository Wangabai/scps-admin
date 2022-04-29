/*
 * @Author: 王鑫
 * @Description: 路由入口
 * @Date: 2022-04-01 10:15:16
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import ProductManageRouter from './modules/ProductManageRouter'
import StudentManageRouter from './modules/StudentManageRouter'
import OrderManageRouter from './modules/OrderManageRouter'
import UserManageRouter from './modules/UserManageRouter'
import PlaceOrderRouter from './modules/PlaceOrderRouter'
import store from '@/store'
import { getItem } from '@/utils/storage'

/**
 * 私有路由表
 */
export const privateRoutes = [
  OrderManageRouter,
  StudentManageRouter,
  ProductManageRouter,
  UserManageRouter,
  PlaceOrderRouter
]

/**
 * 公开路由表
 */
export const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/error',
    component: layout,
    name: 'error',
    redirect: '/error/401',
    children: [
      {
        path: '/error/404',
        name: '404',
        component: () => import('@/views/error-page/404.vue')
      },
      {
        path: '/error/401',
        name: '401',
        component: () => import('@/views/error-page/401.vue')
      }
    ]
  }
]

/**
 * 初始化路由表
 */
export async function initRouter() {
  const roles = getItem('userInfo')
  const accessRoutes = await store.dispatch('user/filterRoutes', roles)
  accessRoutes.forEach((ele: RouteRecordRaw) => {
    router.addRoute(ele)
  })
  return accessRoutes
}

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const isAddRoute = privateRoutes.some((ele) => ele.name === route.name)
    if (isAddRoute && route.name) {
      router.removeRoute(route.name)
    }
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes //[...publicRoutes, ...privateRoutes]
})

export default router
