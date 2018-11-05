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
        totalPage: '',
        currentPage: 1,
        pageSize: 10,
        businessListData: [],

        waybillId: '',
        stepId: '',
        isMatching: false,
        isGettingList: true,

        matchOrderList: [],
        cancelOrderList: [],
        matchedId: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            waybillId: options.waybillId,
            stepId: options.stepId
        })

        console.log('options', options, this.data.stepId)

        this.getMatchedList().then(res => {
            this.getWaybillList();
        })
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
        this.getWaybillList(true);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    searinputChange(e) {
        this.setData({
            searchword: e.detail.value
        })
    },

    startSearch(e) {
        this.setData({
            currentPage: 1,
            businessListData: [],
            matchOrderList: [],
            isGettingList: true,
        })

        this.getWaybillList();
    },

    chooseField(e) {
        this.setData({
            choosedFieldIndex: e.detail.value
        })
    },

    chooseChange(e) {
        let matchOrderListCopy = [...this.data.matchOrderList];
        let cancelOrderListCopy = [...this.data.cancelOrderList];
        const index = e.currentTarget.dataset.index;
        const nowKey = `businessListData[${index}].isChoosed`;
        const rowId = this.data.businessListData[index].id;
        const isAlreadyMatched = this.data.matchedId.includes(rowId);

        console.log('rowId', rowId);
        if (this.data.businessListData[index].isChoosed === 'matched') {
            if (isAlreadyMatched) {
                this.judeIsCancel(rowId).then(result => {

                    cancelOrderListCopy.push(rowId);

                    this.setData({
                        cancelOrderList: cancelOrderListCopy,
                        [nowKey]: 'noMatch',
                    })
                })
            } else {
                for (let i = 0, length = matchOrderListCopy.length; i < length; i++) {
                    if (this.data.businessListData[index].id === matchOrderListCopy[i]) {
                        matchOrderListCopy.splice(i, 1);
                        break;
                    }
                }

                this.setData({
                    matchOrderList: matchOrderListCopy,
                    [nowKey]: 'noMatch',
                })
            }

        } else {
            if (isAlreadyMatched) {
                for (let i = 0, length = cancelOrderListCopy.length; i < length; i++) {
                    if (this.data.businessListData[index].id === cancelOrderListCopy[i]) {
                        cancelOrderListCopy.splice(i, 1);
                        break;
                    }
                }
                this.setData({
                    cancelOrderList: cancelOrderListCopy,
                    [nowKey]: 'matched',
                })
            } else {
                matchOrderListCopy.push(this.data.businessListData[index].id);
                this.setData({
                    matchOrderList: matchOrderListCopy,
                    [nowKey]: 'matched',
                })
            }

        }

    },

    getMatchedList() {

        return new Promise((resolve, reject) => {
            const postData = {
                waybill_order_id: this.data.waybillId
            };

            httpServer('getMatchedList', postData).then(res => {
                if (res.data && res.data.code === 0) {
                    this.setData({
                        matchedId: res.data.data
                    })
                    resolve(res);
                } else {
                    if (res.data && res.data.msg) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                    reject(res)
                }
            })
        })

    },

    getWaybillList(isGetMoreData) {

        let postData = {
            page: this.data.currentPage,
            page_size: this.data.pageSize,
            waybill_id: this.data.waybillId,
        };

        if (this.data.searchword.length) {
            postData[this.data.fieldList[this.data.choosedFieldIndex].id] = this.data.searchword;
        }

        if (!isGetMoreData || this.data.currentPage < this.data.totalPage) {
            if (isGetMoreData) {
                postData.page = this.data.currentPage + 1;
            }
            wx.showLoading({
                title: '数据加载中',
                mask: true,
            });
            httpServer('getBusinessList', postData).then(res => {
                wx.hideLoading();

                if (res.data && res.data.code === 0) {
                    let businessListData = [...this.data.businessListData];
                    let resultsData = [...res.data.data.data];
                    resultsData.map((item, i) => {
                        if (item.status == 'waiting_related') {
                            item.isChoosed = 'noMatch';
                        } else if (['waiting_confirm', 'to_site', 'modify_manager_check', 'modify_department_check'].indexOf(item.status) > -1) {
                            this.data.matchedId.forEach((Hitem) => {
                                if (Hitem == item.id) {
                                    item.isChoosed = 'matched';
                                }
                            });
                        }
                    })
                    businessListData = [...businessListData, ...resultsData];
                    this.setData({
                        businessListData: businessListData,
                        total: res.data.data.count,
                        totalPage: Math.ceil(res.data.data.count / this.data.pageSize),
                        isGettingList: false
                    })
                    if (isGetMoreData) {
                        this.setData({
                            currentPage: this.data.currentPage + 1
                        })
                    }

                } else {
                    if (res.data && res.data.msg) {
                        wx.showModal({
                            content: res.data.msg,
                            showCancel: false,
                        })
                    }
                    this.setData({
                        isGettingList: false
                    })
                }
            }).catch(error => {
                wx.hideLoading();
                this.setData({
                    isGettingList: false
                })
            })
        }

    },
    judeIsCancel(id) {
        return new Promise((resolve, reject) => {
            const postData = {
                section_trip_id: this.data.stepId,
                business_order_id: id
            }
            httpServer('judeIsCancel', postData).then(res => {
                if (res.data.code == 0 && res.data.data.whether_cancel || res.data.code == 1 || res.data.code == -1) {
                    //可以匹配
                    resolve(res);
                } else {
                    wx.showToast({
                        title: '请注意,当前状态不能取消匹配,请核实',
                        icon: 'none'
                    })
                    reject(res)
                }
            })
        })
    },
    confirmMatch() {
        if (this.data.matchOrderList.length || this.data.cancelOrderList.length) {
            const postData = {
                match_order_list: this.data.matchOrderList,
                waybill_id: this.data.waybillId,
                cancel_order_list: this.data.cancelOrderList
            }
            this.setData({
                isMatching: true
            })
            httpServer('matchOrder', postData).then(res => {
                this.setData({
                    isMatching: false
                })
                if (res.data && res.data.code === 0) {
                    wx.reLaunch({
                        url: '/pages/waybillList/waybillList',
                    })
                } else {
                    if (res.data && res.data.msg) {
                        wx.showModal({
                            content: res.data.msg,
                            showCancel: false,
                        })
                    }
                }
            })

        } else {
            wx.showToast({
                title: '请选择业务单',
                icon: 'none',
            })
        }

    }
})