/*
 * @Author: 王鑫
 * @Description: student mockjs
 * @Date: 2022-04-19 11:01:37
 */
import { Random } from 'mockjs'

let list = [
  {
    bopomofoName: 'wangxin',
    chineseName: '王鑫',
    classType: '信息',
    id: 0,
    orders: [
      {
        complete: 0,
        completeDate: '2022-04-19',
        creationDate: '2022-04-19',
        id: 0,
        studentId: 0
      }
    ],
    phoneNumber: '15000000000'
  }
]

for (let i = 0; i < 60; i++) {
  const item = {
    bopomofoName: Random.name(),
    chineseName: Random.cname(),
    classType: Random.region(),
    id: Random.increment(100),
    orders: [
      {
        complete: Random.increment(100),
        completeDate: Random.date('yyyy-MM-dd'),
        creationDate: Random.date('yyyy-MM-dd'),
        id: Random.increment(100),
        studentId: Random.increment(100)
      }
    ],
    phoneNumber: Random.increment(10000000000).toString()
  }
  list.push(item)
}

export default [
  {
    url: '/student/add',
    method: 'post',
    response: (req: any) => {
      //   {
      //     "bopomofoName": "",
      //     "chineseName": "",
      //     "classType": "",
      //     "id": 0, // 更新
      //     "phoneNumber": ""
      // }
      list.push(req.body)
      return {
        code: 200,
        data: null,
        message: '新增成功'
      }
    }
  },
  {
    url: '/student/query',
    method: 'get',
    response: (req: any) => {
      const { size, id, page, bopomofoName, phoneNumber } = req.query
      const data = list.slice(size * (page - 1), size * page)
      if (id) {
        const item = list.find((item) => item.id === id)
        return {
          code: 200,
          data: item,
          message: '请求成功'
        }
      }
      if (bopomofoName) {
        const item = list.find((item) => item.bopomofoName === bopomofoName)
        return {
          code: 200,
          data: { students: [item], total: 1 },
          message: '请求成功'
        }
      }
      if (phoneNumber) {
        const item = list.find((item) => item.phoneNumber === phoneNumber)
        return {
          code: 200,
          data: { students: [item], total: 1 },
          message: '请求成功'
        }
      }
      return {
        code: 200,
        data: {
          students: data,
          total: list.length
        },
        message: '请求成功'
      }
    }
  },
  {
    url: '/student/update',
    method: 'post',
    response: (req: any) => {
      list.push(req.body)
      return {
        code: 200,
        data: null,
        message: '新增成功'
      }
    }
  }
]
