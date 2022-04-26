/*
 * @Author: 王鑫
 * @Description: user mockjs
 * @Date: 2022-04-19 10:28:39
 */
export default [
  {
    url: '/admin/token',
    method: 'post',
    response: (req: any) => {
      const { username, password } = req.body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            role: ['admin'],
            token: 'token',
            tokenHead: 'tokenHead'
          },
          message: '登陆成功'
        }
      } else {
        return {
          code: 500,
          data: null,
          message: '账户密码错误'
        }
      }
    }
  }
]
