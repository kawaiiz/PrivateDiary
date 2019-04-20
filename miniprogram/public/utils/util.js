//转化事件 日期对象转格式
const formatTime = (date, t) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (t === 'second') `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join('-')}`;
  else [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//日期加零转字符串
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

//正则判断输出  集成到页面内 每个页面有自己的表单验证函数
const validateData = data => {
  let num = /^(0|[1-9]\d*)(\.(\d{1,2})?)?$/; //正数
  let intNum = /^(0|[1-9]\d*)$/; //正整数
  let occupancyRate = /^((100|[1-9]?\d)(\.\d{1,2})?)$/; //百分数
  //let name = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/;
  let name = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,10}$/; //长度且不能有空格
  let mobile = /^1\d{10}$/; //手机号码
  let flag = false;
  for (let item in data) {
    switch (item) {

      default:
        break
    }
    if (flag) {
      return false; //因为如果输入正确 是全部遍历难以判断什么时候返回 所以不返回数据 所以当失败时返回数据 以判断是否有失败
    }
  }
  return true;
}

//正则判断调用提示框
const toast = (prompt, cb, time) => {
  setTimeout(() => {
    wx.showToast({
      title: prompt,
      icon: 'none',
      duration: time || 1000,
      complete: function() {
        if (cb) {
          return typeof(cb) === 'function' && cb();
        }
      }
    })
  }, 300)
}

//深拷贝
const deepCopy = (obj) => {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = (obj instanceof Array) ? [] : {};
  for (let attr in obj) {
    if (!obj.hasOwnProperty(attr)) continue;
    copy[attr] = (typeof obj[attr] == "object") ? deepCopy(obj[attr]) : obj[attr];
  }
  return copy;
};

//针对数组中的每项的某个属性排序排序 arr 数组  property 被选择的参数  flag 是 1 升序  0 降序 先全传字符串 再比
const arrSort = (arr, property, flag) => {
  function compare(a, b) {
    a[property] = a[property].toString()
    b[property] = b[property].toString()
    var value1 = a[property].indexOf("-") == -1 ? Number(a[property]) : a[property];
    var value2 = b[property].indexOf("-") == -1 ? Number(b[property]) : b[property];
    var sortFlag
    if (flag == 1) {
      if (value1 > value2) {
        sortFlag = -1
      } else if (value1 < value2) {
        sortFlag = 1
      } else {
        sortFlag = 0
      }
    } else if (flag == 0) {
      if (value1 > value2) {
        sortFlag = 1
      } else if (value1 < value2) {
        sortFlag = -1
      } else {
        sortFlag = 0
      }
    }
    return Number(sortFlag)
  }
  return arr.sort(compare)
}

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  validateData,
  toast,
  deepCopy,
  arrSort
}
