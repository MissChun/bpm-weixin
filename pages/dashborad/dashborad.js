// pages/dashborad/dashborad.js

import {
    httpServer
} from '../../api/request.js'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        dashboradList: [{
            title: '待匹配卸货地',
            num: '',
            params: 'section_waiting_match_count',
            url: '/pages/waybillList/waybillList',
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let token = '';
        let _this = this;
        let postData = {
            filter_type: 'service_centre_schedule'
        }
        httpServer('getDashborad', postData).then(res => {
            if (res.data && res.data.code === 0) {
                let dashboradListCopy = [...this.data.dashboradList];
                dashboradListCopy[0].num = res.data.data.section_waiting_match_count;

                this.setData({
                    dashboradList: dashboradListCopy
                })

            } else {
                if (res.data && res.data.message) {
                    wx.showModal({
                        content: res.data.message,
                        showCancel: false,
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})