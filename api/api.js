/**
 * @description 接口文档API,用于后端接口查询
 * @param
 *   url:后端接口url（必需）
 *   method:后端接口方法（必需）
 *   desc:后端接口描述 （可选）
 *   param:接口参数 （可选）
 *     desc:参数描述（可选）
 */

const api = {
  getDashborad: {
    url: '/bpmwechat/iYdejC/dashborad',
    method: 'get',
    desc: '获取dashborad数据',
    param: {

    }
  },
  getWaybillList: {
    url: '/bpmwechat/iYdejC/section-trips',
    method: 'get',
    desc: '获取waybill数据',
    param: {

    }
  },

  getBusinessList: {
    url: '/bpmwechat/iYdejC/business_order',
    method: 'get',
    desc: '匹配运单时获取业务单列表',
    param: {

    }
  },

  matchOrder:{
    url: '/bpmwechat/iYdejC/waybill-business/match-business-order/',
    method: 'post',
    desc: '匹配卸货单',
    param: {

    }
  }

}

export default api;