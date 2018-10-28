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
            label: '业务单号',
            id: 'order_number',
        }, {
            label: '客户简称',
            id: 'short_name',
        }, {
            label: '液厂',
            id: 'actual_fluid_name',
        }, {
            label: '收货人',
            id: 'consignee',
        }, {
            label: '业务员',
            id: 'sale_man_name',
        }],
        choosedFieldIndex: 0,
        searchword: '',
        total: '',
        currentPage: 1,
        pageSize: 10,
        businessListData: [],

        waybillId: '',
        matchOrderList: [],
        isMatching: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('options', options);
        this.setData({
            waybillId: options.waybillId
        })

        this.getWaybillList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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

    searinputChange(e) {
        console.log('e', e);
        this.setData({
            searchword: e.detail.value,
            currentPage: 1,
            businessListData: [],
            matchOrderList: []
        })

        this.getWaybillList();


    },

    chooseField(e) {
        this.setData({
            choosedFieldIndex: e.detail.value
        })
    },

    chooseChange(e) {
        console.log('e', e);
        let index = e.currentTarget.dataset.index;
        let nowKey = `businessListData[${index}].isChoosed`;
        let matchOrderListCopy = [...this.data.matchOrderList];
        console.log('nowKey', nowKey);

        if (this.data.businessListData[index].isChoosed) {
            for (let i = 0, length = matchOrderListCopy.length; i < length; i++) {
                if (this.data.businessListData[index].id === matchOrderListCopy[i]) {
                    matchOrderListCopy.splice(i, 1);
                    break;
                }
            }
        } else {
            matchOrderListCopy.push(this.data.businessListData[index].id);
            this.setData({
                matchOrderList: matchOrderListCopy
            })
        }
        this.setData({
            [nowKey]: !this.data.businessListData[index].isChoosed,
            matchOrderList: matchOrderListCopy
        })

        console.log('this.data.matchOrderList', this.data.matchOrderList);
    },

    getWaybillList(isGetMoreData) {

        let postData = {
            page: this.data.currentPage,
            page_size: this.data.pageSize,
            waybill_id: this.data.waybillId,
        };

        if (this.data.searchword.length) {
            postData[this.data.fieldList[choosedFieldIndex].id] = this.data.searchword;
        }

        if (!isGetMoreData || this.data.currentPage <= Math.ceil(this.data.total / this.data.pageSize)) {
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            });
            httpServer('getBusinessList', postData).then(res => {
                wx.hideLoading();
                if (res.data && res.data.code === 0) {
                    let businessListData = [...this.data.businessListData];
                    let resultsData = [...res.data.data.data];
                    resultsData.map(item => {
                        item.isChoosed = false;
                    })
                    businessListData = [...businessListData, ...resultsData];
                    this.setData({
                        businessListData: businessListData,
                        total: res.data.data.count
                    })

                    console.log('this.data.businessListData', this.data.businessListData)
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
    confirmMatch() {
        if (this.data.matchOrderList.length) {
            const postData = {
                match_order_list:this.data.matchOrderList,
                waybill_id:this.data.waybillId,
                cancel_order_list:[]
            }
            this.setData({
                isMatching: true
            })
            httpServer('matchOrder', postData).then(res => {
                this.setData({
                    isMatching: false
                })
                if (res.data && res.data.code === 0) {
                    wx.switchTab({
                        url: '/pages/waybillList/waybillList',
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

        }else{
            wx.showToast({
                title: '请选择业务单',
                icon: 'none',
            })
        }

    }
})