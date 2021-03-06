// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()               // 初始化云数据库

/**
 * 加载 request-promise 库，可在 github 上搜 request 查找如何安装和使用,云函数需要向第三方服务器发送请求来获取数据，就* 是使用了这个 request 请求库。
 */
const rp = require('request-promise')               

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get()            // 要注意，网络请求，数据库操作都是异步操作
  const countResult = await playlistCollection.count()      // count() 返回的是一个对象
  const total = countResult.total                           // 获取所有数据的总数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  
  const newData = []
  for(let i = 0; i < playlist.length; i++) {
    let flag = true
    for(let j = 0; j < list.data.length; j++) {                 // 注意读取数据库集合中的数据要加 .data
      if(playlist[i].id == list.data[j].id) {
        flag = false
        break
      }
    }
    if(flag) {
      newData.push(playlist[i])
    }
  }

  for(let i = 0; i < newData.length; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        currentTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log('插入失败')
    })
  }

  return newData.length
}