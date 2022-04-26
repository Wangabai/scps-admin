/*
 * @Author: 王鑫
 * @Description: 下单路由
 * @Date: 2022-04-25 11:13:59
 */
import layout from '@/layout/index.vue'

export default {
  path: '/place',
  component: layout,
  roles: 'placeOrder',
  name: 'place',
  children: [
    {
      path: '/place-order',
      name: 'PlaceOrder',
      component: () => import('@/views/place-order/index.vue'),
      meta: {
        title: '下单操作',
        icon: 'el-icon-s-order'
      }
    }
  ]
}
