// pages/setting/setting.js
import {
    httpServer
} from '../../api/request.js'
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
            }
        })
    },
    logout: function() {

        wx.showModal({
            title: '请确认',
            content: '退出账号',
            success(res) {
                if (res.confirm) {
                    wx.clearStorage();
                    wx.redirectTo({
                        url: '/pages/index/index'
                    })
                    // httpServer('logout').then(res => {
                    //     if (res.data && res.data.code === 1) {
                    //         wx.clearStorage();
                    //         wx.redirectTo({
                    //             url: '/pages/index/index'
                    //         })

                    //     }
                    // })

                } else if (res.cancel) {
                    //console.log('用户点击取消')
                }
            }
        })


    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})