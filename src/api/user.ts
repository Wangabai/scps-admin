/*
 * @Author: 王鑫
 * @Description: user接口
 * @Date: 2022-04-01 13:24:36
 */
import { http } from '@/utils/http';
import { USER_SERVER } from '@/config'

// 登陆
export function login(parmas: object): Promise<any> {
  return http.post(`${USER_SERVER}/token`, parmas);
}

// 用户列表
export function userList(parmas: object): Promise<any> {
  return http.get(`${USER_SERVER}/query`, parmas);
}

// 新增用户
export function addUser(parmas: object): Promise<any> {
  return http.post(`${USER_SERVER}/add`, parmas);
}

// 删除用户
export function delUser(parmas: string): Promise<any> {
  return http.post(`${USER_SERVER}/remove?adminId=${parmas}`);
}

// 变更用户
export function updateUser(parmas: object): Promise<any> {
  return http.post(`${USER_SERVER}/update`, parmas);
}
