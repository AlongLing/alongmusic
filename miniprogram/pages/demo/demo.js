// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      console.log(res);
      this.setData({
        openid: res.result.openid
      });
    }).catch((err) => {
      console.error(err);
    });

    /* setTimeout(() => {
      console.log(1)
    }, 1000)
    console.log(2) */

    // 使用 promise 完成异步请求
    /* new Promise((reslove, reject) => {
      setTimeout(() => {
        console.log(1)
        reslove()
      }, 1000)
    }).then((res) => {
      setTimeout(() => {
        console.log(2)
      }, 2000)
    }) */

    // 使用 async await ES7 的语法实现异步操作

    this.foo()
  },

  async foo() {
    console.log('foo')
    let res = await this.timeout()
    console.log(res)
  },
  timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(1)
        resolve('resolved')
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})