/*
 * @Author: 王鑫
 * @Description: product mockjs
 * @Date: 2022-04-19 11:01:27
 */
import { Random } from 'mockjs'
const list: any = [
  {
    id: 1,
    inventory: 0,
    price: 12.5,
    productName: '产品'
  }
]

for (let i = 0; i < 60; i++) {
  const item = {
    id: Random.increment(100),
    inventory: Random.increment(100),
    price: Random.float(10, 800),
    productName: Random.cname()
  }
  list.push(item)
}

export default [
  {
    url: '/product/add',
    method: 'post',
    response: (req: any) => {
      //   {
      //     "id": "", // 更新
      //     "inventory": 0,
      //     "price": 0,
      //     "productName": ""
      // }
      return {
        code: 200,
        data: null,
        message: '新增成功'
      }
    }
  },
  {
    // 增加产品库存
    url: '/product/addInventory',
    method: 'post',
    response: (req: any) => {
      //   {
      //     "addedInventory": 0,
      //     "productId": ""
      // }
      return {
        code: 200,
        data: null,
        message: '新增成功'
      }
    }
  },
  {
    // 新增多个产品
    url: '/product/addList',
    method: 'post',
    response: (req: any) => {
      // [
      //     {
      //       "id": "",
      //       "inventory": 0,
      //       "price": 0,
      //       "productName": ""
      //   }
      // ]
      return {
        code: 200,
        data: null,
        message: '新增成功'
      }
    }
  },
  {
    url: '/product/query',
    method: 'get',
    response: (req: any) => {
      const { size, id, page } = req.query
      const data = list.slice(size * (page - 1), size * page)
      if (id) {
        const item = list.find((item) => item.id === id)
        return {
          code: 200,
          data: item,
          message: '请求成功'
        }
      }
      return {
        code: 200,
        data: {
          products: data,
          total: list.length
        },
        message: '请求成功'
      }
    }
  },
  {
    url: '/product/update',
    method: 'post',
    response: (req: any) => {
      return {
        code: 200,
        data: {},
        message: '更新成功'
      }
    }
  }
]
