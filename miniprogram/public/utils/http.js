const util = require('./util.js')
const baseURL = ''; //域名地址
const imageURL = 'http://132.232.207.79:8088/img/PrivateDiary/'; //图片icon地址
const qqMapKey = 'PM6BZ-7KZWR-XDPWZ-WR3PX-HNSJV-DVB6G'
/**
 * 请求函数说明
 *
 * 1.每一次的请求都会带上token,如果token不存在则token赋空值
 * 2.采用promise写法。当请求成功，返回promise回正确的流程中，否则则会直接进行统一处理
 * 3.请求成功返回promise分为两种情况 ①status/code=1 返回resolve ②status/code=0 返回reject
 * 4.请求失败返回 返回reject
 *
 * */

/**
 * 请求成功
 */
const requestSuccess = (res, app, requestTask) => {
  for (let i = 0; i < app.globalData.requestList.length; i++) {
    if (app.globalData.requestList[i] === requestTask) {
      app.globalData.requestList.splice(i, 1)
    }
  }
  if (res && (res.statusCode == 200 || res.statusCode == 304)) {
    if (res.data.status == 0 || res.data.code == 0) {
      return Promise.reject(res.data)
    } else if (res.data.status == 1 || res.data.code == 1 || res.data.code == 200 ) {
      return Promise.resolve(res.data)
    } else if (res.data.status == 2 || res.data.code == 2) {
      wx.removeStorage({
        key: 'token',
        success: function (res) {
          console.log(res.data)
        }
      })
      // 登录失效  关闭请求阈值
      app.globalData.requestFlag = false;
      util.toast("当前登录信息已经失效，请重新授权登录", setTimeout(function () {
        wx.reLaunch({
          url: '/pages/login/login/login'
        })
      }, 1500))
      return Promise.reject(res.data)
    }else{
      return Promise.reject(res.data)
    }
  } else {
    console.log(res)
    return Promise.reject({
      message:'网络出了点小问题'
    })
    app.globalData.requestFlag = false;
    // wx.removeStorage({
    //   key: 'token',
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
    util.toast('网络错误', setTimeout(function () {
      wx.navigateTo({
        url: '/pages/error/error?t=error'
      })
    }, 1000))
  }
}

/**
 * 请求失败
 */
const requestFail = (err, app) => {
  app.globalData.requestFlag = false;
  for (let i = app.globalData.requestList.length-1; i >= 0; i--) {
    if(app.globalData.requestList[i].abort) app.globalData.requestList[i].abort();
    app.globalData.requestList.pop()
  }
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/error/error?t=error'
    })
  }, 1000)
}

/**
 * 请求  option => url部分地址  allUrl 全部地址   data 携带数据   noLoad 加载动画   t 请求类型
 */
const request = (option = {
  data: {},
  url: ''
}, app) => {
  return new Promise((resolve, reject) => {
    //全局变量控制请求 以免一条报错 多次弹出错误页
    if (!app.globalData.requestFlag) return reject({
      message:'请稍后重试！'
    })
    if (!option.noLoad) {
      wx.showLoading({
        title: '请稍等',
      })
    }

    //给每次请求配上题token
    option.data.token = app.globalData.token ||' '
    //请求主体
    const requestTask = wx.request({
      url: option.allUrl ? option.allUrl : baseURL + option.url,
      data: option.data,
      header: {
        'Content-Type': option.contentType === 'json' ?'application/json;charset=UTF-8':'application/x-www-form-urlencoded;charset=UTF-8' ,
        'Authorization':app.globalData.token ||' ',
        'token':app.globalData.token ||' '
      },
      method: option.t ? option.t : 'POST',
      success: function (res) {
        resolve({res, app, requestTask})
      },
      fail: function (err) {
        requestFail(err, app)
        return reject({
          message:'请求失败'
        })
      },
      complete: function () {
        if (!option.noLoad) {
          wx.hideLoading();
        }
      }
    });
    app.globalData.requestList.push(requestTask)
  }).then((data) => {
    let {res, app, requestTask} = data
    return requestSuccess(res, app, requestTask)
  })
}

const upFile = (option,app)=>{
  return new Promise((resolve, reject) => {

    //全局变量控制请求 以免一条报错 多次弹出错误页
    if (!app.globalData.requestFlag) return reject({
      message:'请稍后重试！'
    })

    if (!option.noLoad) {
      wx.showLoading({
        title: '请稍等',
      })
    }
    console.log(option.filePath)
    let requestTask = wx.uploadFile({
      url: baseURL+upFileURL,
      filePath: option.filePath,
      name: option.fileName||'file',
      header: {
        // 'Content-Type': option.contentType === 'json' ?'application/json;charset=UTF-8':'multipart/form-data',
        'Authorization':app.globalData.token ||' '
      },
      formData: {

      },
      success: function (res) {
        res.data = JSON.parse(res.data)
        resolve({res, app, requestTask})
      },
      fail: function (err) {
        requestFail(err, app)
        return reject({
          message:'上传失败'
        })
      },
      complete: function () {
        if (!option.noLoad) {
          wx.hideLoading();
        }
      }
    })
    app.globalData.requestList.push(requestTask)
  }).then((data) => {
    let {res, app, requestTask} = data
    return requestSuccess(res, app, requestTask)
  })
}
module.exports = {
  request,
  baseURL,
  imageURL,
  upFile
}
