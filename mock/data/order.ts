/*
 * @Author: 王鑫
 * @Description: order mockjs
 * @Date: 2022-04-19 11:01:33
 */
import { Random } from 'mockjs'
const list: any = [
  {
    complete: 0,
    completeDate: '2022-04-19',
    creationDate: '2022-04-19',
    id: 0,
    studentId: 0
  }
]

for (let i = 0; i < 60; i++) {
  const item = {
    id: Random.increment(100),
    completeDate: Random.date('yyyy-MM-dd'),
    creationDate: Random.date('yyyy-MM-dd'),
    complete: Random.increment(100),
    studentId: Random.increment(100)
  }
  list.push(item)
}

export default [
  {
    url: '/order/query',
    method: 'get',
    response: (req: any) => {
      const { size, page } = req.query
      const data = list.slice(size * (page - 1), size * page)
      return {
        code: 200,
        data: {
          products: data,
          total: list.length
        },
        message: '请求成功'
      }
    }
  // },
  // {
  //   url: '/order/queryUnpaid',
  //   method: 'get',
  //   response: (req: any) => {
  //     const { size, id } = req.body
  //     return {
  //       code: 200,
  //       data: {
  //         products: list,
  //         total: list.length
  //       },
  //       message: '请求成功'
  //     }
  //   }
  }
]
