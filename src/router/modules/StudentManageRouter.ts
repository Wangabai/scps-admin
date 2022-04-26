/*
 * @Author: 王鑫
 * @Description: 学生管理路由
 * @Date: 2022-04-18 15:29:20
 */

import layout from '@/layout/index.vue'

export default {
  path: '/student',
  component: layout,
  roles: 'student',
  name: 'student',
  children: [
    {
      path: '/student/list',
      name: 'StudentList',
      component: () => import('@/views/student-manage/index.vue'),
      meta: {
        title: '学生管理',
        icon: 'el-icon-user'
      }
    }
  ]
}
