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
    totalPage: '',
    searchword: '',
    topBarList: [{
      label: '装车',
      param: 'all_truck_loaded',
      isChoosed: false
    }, {
      label: '匹配卸车',
      param: 'all_match',
      isChoosed: true
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
    currentChoosedBar: 'all_match',
    waybillListData: [],
    isGettingList: true,
    postDataCopy: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getWaybillList();
  },

  onPullDownRefresh() {
    //wx.startPullDownRefresh();
    this.setData({
      currentPage: 1,
      waybillListData: [],
      isGettingList: true,
    })
    this.getWaybillList().then(res => {
      wx.stopPullDownRefresh()
    }).catch(error => {
      wx.stopPullDownRefresh()
    });
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

  chooseField(e) {
    this.setData({
      choosedFieldIndex: e.detail.value
    })
  },
  searinputChange(e) {
    this.setData({
      searchword: e.detail.value
    })
  },
  startSearch(e) {
    this.setData({
      currentPage: 1,
      waybillListData: [],
      isGettingList: true,
    })
    this.getWaybillList();
  },
  getWaybillList(isGetMoreData) {

    return new Promise((resolve, reject) => {
      let postData = {
        page: this.data.currentPage,
        page_size: this.data.pageSize,
        search: this.data.currentChoosedBar,
      };

      if (this.data.searchword.length) {
        postData[this.data.fieldList[this.data.choosedFieldIndex].id] = this.data.searchword;
      }

      if (!isGetMoreData || this.data.currentPage < this.data.totalPage) {

        if (isGetMoreData) {
          postData = this.data.postDataCopy;
          postData.page = this.data.currentPage + 1;
        } else {
          //备份搜索条件
          this.setData({
            postDataCopy: postData,
          })
        }

        wx.showLoading({
          title: '数据加载中',
          mask: true,
        });
        this.setData({
          isGettingList: true
        })
        httpServer('getWaybillList', postData).then(res => {
          wx.hideLoading();
          if (res.data && res.data.code === 0) {
            let resultsData = res.data.data.data;

            if (resultsData.length) {
              let tractorList = resultsData.map(item => item.capacity);

              this.getTractor(tractorList).then(result => {
                let tractorListData = result.data.data.results;

                resultsData.map((item, index) => {
                  item.stations = '';
                  item.unload_trips.map((trips, key) => {
                    item.stations = item.stations + trips.business_order.station +(key < item.unload_trips.length-1?',':'');
                  })
                  tractorListData.map((tractorItem, tractorIndex) => {
                    if (tractorItem.id === item.capacity) {
                      item.capacityDetail = tractorItem;
                    }
                  })
                })
                let waybillListData = [...this.data.waybillListData, ...resultsData];
                this.setData({
                  waybillListData: waybillListData,
                  total: res.data.data.count,
                  totalPage: Math.ceil(res.data.data.count / this.data.pageSize),
                  isGettingList: false
                })
                if (isGetMoreData) {
                  this.setData({
                    currentPage: this.data.currentPage + 1
                  })
                }
              });
            } else {
              this.setData({
                waybillListData: [...this.data.waybillListData],
                total: res.data.data.count,
                totalPage: Math.ceil(res.data.data.count / this.data.pageSize),
                isGettingList: false
              })
            }


          } else {
            this.setData({
              isGettingList: false
            })
          }
          resolve(res)
        }).catch(error => {
          wx.hideLoading();
          this.setData({
            isGettingList: false
          })
          reject(error)
        })
      }
    })



  },
  chooseBar(e) {
    const choosedParam = e.currentTarget.dataset.param;
    if (this.currentChoosedBar !== choosedParam) {
      let topBarListCopy = [...this.data.topBarList];
      topBarListCopy.map(item => {
        item.isChoosed = item.param === choosedParam ? true : false;
      })
      this.setData({
        topBarList: topBarListCopy,
        currentChoosedBar: choosedParam,
        currentPage: 1,
        waybillListData: [],
        isGettingList: true,
      })

      this.getWaybillList();
    }
  },
  goMatch(e) {
    const waybillId = e.currentTarget.dataset.id;
    const stepId = e.currentTarget.dataset.stepid;
    wx.navigateTo({
      url: '/pages/matchWaybill/matchWaybill?waybillId=' + waybillId + '&stepId=' + stepId
    })
  },
  getTractor(tractorList) {
    return new Promise((resolve, reject) => {
      const postData = {
        tractor_list: tractorList.join(',')
      }
      httpServer('getTractor', postData).then(res => {
        if (res.data && res.data.code === 0) {
          resolve(res);
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })

  }
})