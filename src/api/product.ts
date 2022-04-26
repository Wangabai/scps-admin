/*
 * @Author: 王鑫
 * @Description: 产品接口
 * @Date: 2022-04-08 15:02:01
 */
import { http } from '@/utils/http';
import { PRODUCT_SERVER } from '@/config'


// 新增产品
export function  productAdd(parmas: object): Promise<any> {
  return http.post(`${PRODUCT_SERVER}/add`, parmas);
}

// 新增产品库存
export function productAddInventory(parmas: object): Promise<any> {
  return http.post(`${PRODUCT_SERVER}/addInventory`, parmas);
}

// 新增产品 - 列表
export function productAddList(parmas: object): Promise<any> {
  return http.post(`${PRODUCT_SERVER}/addList`, parmas);
}

// 产品列表
export function productQuery(parmas: object): Promise<any> {
  return http.get(`${PRODUCT_SERVER}/query`, parmas);
}

// 产品详情
export function productDetail(parmas: string): Promise<any> {
  return http.get(`${PRODUCT_SERVER}/query/${parmas}`);
}

// 产品更新
export function productUpdate(parmas: object): Promise<any> {
  return http.post(`${PRODUCT_SERVER}/update`, parmas);
}