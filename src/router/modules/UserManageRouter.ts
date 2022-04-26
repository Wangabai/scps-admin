/*
 * @Author: 王鑫
 * @Description: 用户管理路由
 * @Date: 2022-04-21 13:52:28
 */
import layout from '@/layout/index.vue'

export default {
  path: '/user',
  component: layout,
  roles: 'admin',
  name: 'admin',
  children: [
    {
      path: '/user/list',
      name: 'UserList',
      component: () => import('@/views/user-manage/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'el-icon-user'
      }
    }
  ]
}
