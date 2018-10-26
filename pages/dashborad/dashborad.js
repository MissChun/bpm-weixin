// pages/dashborad/dashborad.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dashboradList:[{
      title:'待匹配卸货地',
      num:'',
      params:'section_waiting_match_count'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = '';
    wx.getStorage({
      key:'token',
      success(res){
        console.log('res',res);
        token = res.data;
        wx.request({
          url: 'http://39.104.71.159:6602/bpmwechat/iYdejC/dashborad', //仅为示例，并非真实的接口地址
          method:'GET',
          data: {
            filter_type: 'service_centre_schedule'
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': 'jwt ' + token
          },
          success (res) {
            if (res.data && res.data.code === 1) {
              let dashboradListCopy = [...dashboradList];
              dashboradListCopy.map(item => {
                
              })
            }else{
              if(res.data && res.data.message){
                wx.showModal({
                  content: res.data.message,
                  showCancel:false,
                })
              }
            }
          },
          fail(error){
            wx.showModal({
              content: error,
              showCancel:false,
            })
          }
        })
      }
    });
    
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