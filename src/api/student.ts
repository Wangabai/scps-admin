/*
 * @Author: 王鑫
 * @Description: 学生接口
 * @Date: 2022-04-19 13:23:57
 */
import { http } from '@/utils/http'
import { STUDENT_SERVER } from '@/config'


// 新增学生
export function studentAdd(parmas: object): Promise<any> {
  return http.post(`${STUDENT_SERVER}/add`, parmas)
}

// 学生列表
export function studentQuery(parmas: object): Promise<any> {
  return http.post(`${STUDENT_SERVER}/query`, parmas)
}

// 学生详情
export function studentDetail(parmas: string): Promise<any> {
  return http.get(`${STUDENT_SERVER}/query/${parmas}`)
}

// 新增学生
export function studentUpdate(parmas: object): Promise<any> {
  return http.post(`${STUDENT_SERVER}/update`, parmas)
}

