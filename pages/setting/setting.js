// pages/setting/setting.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                _this.setData({
                    userInfo: res.data
                })
                console.log('this',_this.data.userInfo);
            }
        })


    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})