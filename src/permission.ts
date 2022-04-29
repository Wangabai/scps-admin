/*
 * @Author: 王鑫
 * @Description: 权限控制
 * @Date: 2022-04-12 17:20:50
 */
import router from './router'
import store from './store'
import { initRouter } from '@/router'

// 白名单
const whiteList = ['/login']
/**
 * 路由前置守卫
 */
router.beforeEach(async (to, from, next) => {
  let path
  console.log(store.getters.token)
  // 存在 token ，进入主页
  if (store.getters.token) {
    const addRoutes = store.state.user.addRoutes
    const isLogin = to.path === '/login'
    if (addRoutes.length > 0) {
      if (isLogin) {
        const [firstRoute] = addRoutes
        const firstPath = firstRoute.children[0].path
        next(firstPath)
      } else {
        next()
      }
    } else {
      try {
        const accessRoutes = await initRouter()
        const [firstRoute] = accessRoutes
        const firstPath = firstRoute.children[0].path
        if (isLogin) {
          next(firstPath)
        } else {
          next({ ...to, replace: true })
        }
      } catch (err) {
        next('/login')
        throw err
      }
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next(path)
    } else {
      next('/login')
    }
  }
})
