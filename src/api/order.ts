/*
 * @Author: 王鑫
 * @Description: 订单管理
 * @Date: 2022-04-19 13:23:49
 */
import { http } from '@/utils/http'
import { ORDER_SERVER } from '@/config'

// 订单列表
export function orderQuery(parmas: object): Promise<any> {
  return http.post(`${ORDER_SERVER}/query`, parmas)
}

// 获取订单详情
export function orderDetail(parmas: string): Promise<any> {
  return http.get(`${ORDER_SERVER}/query/${parmas}`)
}

// 付款
export function pay(parmas: object): Promise<any> {
  return http.post(`${ORDER_SERVER}/markAsPaid`, parmas)
}


// 下单
export function placeOrder(parmas: object): Promise<any> {
  return http.post('/api/placeOrder',parmas)
}