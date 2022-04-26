/*
 * @Author: 王鑫
 * @Description:
 * @Date: 2022-04-19 13:35:08
 */
import layout from '@/layout/index.vue'

export default {
  path: '/order',
  component: layout,
  roles: 'order',
  name: 'order',
  children: [
    {
      path: '/order/list',
      name: 'OrderList',
      component: () => import('@/views/order-manage/index.vue'),
      meta: {
        title: '订单管理',
        icon: 'el-icon-s-order'
      }
    }
  ]
}
