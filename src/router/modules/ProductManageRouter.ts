/*
 * @Author: 王鑫
 * @Description: 产品路由
 * @Date: 2022-04-18 15:29:20
 */
import layout from '@/layout/index.vue'

export default {
  path: '/product',
  component: layout,
  roles: 'product',
  name: 'product',
  children: [
    {
      path: '/product/list',
      name: 'ProductList',
      component: () => import('@/views/product-manage/index.vue'),
      meta: {
        title: '产品管理',
        icon: 'el-icon-goods'
      }
    }
  ]
}
