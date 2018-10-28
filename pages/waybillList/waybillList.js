// pages/waybillList/waybillList.js

import {
    httpServer
} from '../../api/request.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fieldList: [{
            id: 'carrier_name',
            label: '承运商'
        }, {
            id: 'order_number',
            label: '订单号'
        }, {
            id: 'truck_no',
            label: '车号'
        }, {
            id: 'fluid_name',
            label: '液厂名'
        }, {
            id: 'waybill_number',
            label: '运单号'
        }, {
            id: 'order_station',
            label: '卸货站点'
        }],
        choosedFieldIndex: 2,
        pageSize: 10,
        currentPage: 1,
        total: '',
        searchword: '',
        topBarList: [{
            label: '装车',
            param: 'all_truck_loaded',
            isChoosed: true
        }, {
            label: '匹配卸车',
            param: 'all_match',
            isChoosed: false
        }, {
            label: '卸车',
            param: 'all_unload',
            isChoosed: false
        }, {
            label: '变更中',
            param: 'all_change',
            isChoosed: false
        }, {
            label: '全部',
            param: '',
            isChoosed: false
        }],
        currentChoosedBar: 'all_truck_loaded',
        waybillListData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getWaybillList();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.setData({
            currentPage: this.data.currentPage + 1
        })
        this.getWaybillList(true);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    chooseField(e) {
        console.log('e.detail', e.detail, this.data.choosedFieldIndex);
        this.setData({
            choosedFieldIndex: e.detail.value
        })
    },
    searinputChange(e) {
        console.log('e', e);
        this.setData({
            searchword: e.detail.value
        })
    },
    getWaybillList(isGetMoreData) {

        let postData = {
            page: this.data.currentPage,
            page_size: this.data.pageSize,
            search: this.data.currentChoosedBar,
        };

        if (this.data.searchword.length) {
            postData[this.data.fieldList[choosedFieldIndex].id] = this.data.searchword;
        }

        if (!isGetMoreData || this.data.currentPage <= Math.ceil(this.data.total / this.data.pageSize)) {
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            });
            httpServer('getWaybillList', postData).then(res => {
                wx.hideLoading();
                if (res.data && res.data.code === 0) {
                    let waybillListData = [...this.data.waybillListData];
                    waybillListData = [...waybillListData, ...res.data.data.data];
                    this.setData({
                        waybillListData: waybillListData,
                        total: res.data.data.count
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
        }
    },
    chooseBar(e) {
        console.log('e', e);
        const choosedParam = e.currentTarget.dataset.param;
        if (this.currentChoosedBar !== choosedParam) {
            let topBarListCopy = [...this.data.topBarList];
            console.log('topBarListCopy', topBarListCopy);
            topBarListCopy.map(item => {
                item.isChoosed = item.param === choosedParam ? true : false;
            })
            this.setData({
                topBarList: topBarListCopy,
                currentChoosedBar: choosedParam,
                currentPage: 1,
                waybillListData: [],
            })

            this.getWaybillList();
        }
    },
    goMatch(e) {
        console.log('e', e);
        const waybillId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/matchWaybill/matchWaybill?waybillId=' + waybillId
        })
    }
})