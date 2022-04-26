/*
 * @Author: 王鑫
 * @Description: VUEX user
 * @Date: 2022-04-01 13:56:11
 */
import { login } from '@/api/user'
import { setItem, getItem, removeAllItem } from '@/utils/storage'
import { TOKEN } from '@/constant'
import { setTimeStamp } from '@/utils/auth'
import { publicRoutes, privateRoutes, resetRouter } from '@/router'

export interface UserStateTypes {
  token: string
  userInfo: object
  routes: object
  addRoutes: []
}

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: [],
    // 初始化路由表
    addRoutes: [],
    routes: []
  }),
  mutations: {
    setToken(state: UserStateTypes, token: string) {
      state.token = token
      setItem(TOKEN, token)
    },
    setUserInfo(state: UserStateTypes, userInfo: any) {
      state.userInfo = userInfo
      setItem('userInfo', userInfo)
    },
    // 增加路由
    setRoutes(state: UserStateTypes, newRoutes: []) {
      state.addRoutes = newRoutes
      // 永远在静态路由的基础上增加新路由
      state.routes = publicRoutes.concat(newRoutes) //[...publicRoutes, ...newRoutes]
    }
  },
  actions: {
    // 登陆请求
    login(context: any, userInfo: object) {
      return new Promise<void>((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            context.commit('setToken', res.data.tokenHead + res.data.token)
            context.commit('setUserInfo', res.data.roles)
            setTimeStamp()
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    /**
     * 根据权限筛选路由
     */
    filterRoutes(context: any, menus: []) {
      const routes = []
      // 路由权限匹配
      menus.forEach((key) => {
        // 权限名 与 路由的 name 匹配
        routes.push(...privateRoutes.filter((item) => item.roles === key))
      })
      // 最后添加 不匹配路由进入 404
      routes.push({
        path: '/:catchAll(.*)',
        name: 'errorpage',
        redirect: '/error/404'
      })
      context.commit('setRoutes', routes)
      return routes
    },
    // 退出登陆
    logout(context: any) {
      resetRouter()
      context.commit('setToken', '')
      context.commit('setUserInfo', [])
      removeAllItem()
    }
  }
}
