// 未优化写法

fetch('/api')
  .then(
    res => {
      console.log('联系服务器成功！')
      return res.json()
    },
    err => {
      console.log('联系服务器失败！', err)
      return new Promise(() => { }) // 返回初始化的 Promise 以中断 then 链
    }
  )
  .then(
    res => console.log('接收到数据：', res),
    err => console.log('接收数据失败!', err)
  )

// 优化写法

fetch('/api')
  .then(
    res => {
      console.log('联系服务器成功！')
      return res.json()
    }
  )
  .then(
    res => console.log('接收到数据：', res)
  )
  .catch(
    err => console.log('请求失败！', err)
  )

// await 写法

try {
  const res = await fetch('/api')
  const data = await res.json()
  console.log('接收到数据：', data)
} catch (err) {
  console.log('请求失败！', err)
}