// pages/waybillList/waybillList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldList:[
      { id: 'carrier_name', label: '承运商' },
      { id: 'order_number', label: '订单号' },
      { id: 'truck_no', label: '车号' },
      { id: 'fluid_name', label: '液厂名' },
      { id: 'waybill_number', label: '运单号' },
      { id: 'order_station', label: '卸货站点' }
    ],
    choosedFieldIndex:2,
    topBarList:[{
      label:'装车',
      param:'all_truck_loaded',
      isChoosed:true
    },{
      label:'匹配卸车',
      param:'all_match',
      isChoosed:false
    },{
      label:'卸车',
      param:'all_unload',
      isChoosed:false
    },{
      label:'变更中',
      param:'all_change',
      isChoosed:false
    },{
      label:'全部',
      param:'',
      isChoosed:false
    }],
    currentChoosedBar:'all_truck_loaded',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  chooseField(e){
     console.log('e.detail',e.detail,this.data.choosedFieldIndex);
     this.setData({
      choosedFieldIndex: e.detail.value
    })
  },
  getWaybillList(){
    
  },
  chooseBar(e){
    console.log('e',e);
    const choosedParam = e.currentTarget.dataset.param;
    if(this.currentChoosedBar !== choosedParam){
      let topBarListCopy = [...this.data.topBarList];
      console.log('topBarListCopy',topBarListCopy);
      topBarListCopy.map(item => {
        item.isChoosed = item.param === choosedParam ? true : false;
      })
      this.setData({
        topBarList:topBarListCopy,
        currentChoosedBar:choosedParam,
      })
    }
  }
})