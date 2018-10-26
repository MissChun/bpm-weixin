Page({
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },
  data: {
    isSendAjax:false,
  },
  verifyForm(formData){
    let   verifyFormResult = {
            isVerify : true,
            errorMsg:'',
          };
    if(formData.name.length){
      if(!formData.name.match(/^1\d{10}$/)){
        verifyFormResult = {
          isVerify : false,
          errorMsg:'请填写正确的电话号码',
        };
        return verifyFormResult
      }
    }else{
      verifyFormResult = {
        isVerify : false,
        errorMsg:'请填写电话号码',
      };
      return verifyFormResult
    }

    if(!formData.password.length){
      verifyFormResult = {
        isVerify : false,
        errorMsg:'请填写密码',
      };
      return verifyFormResult
    }

    return verifyFormResult;

  },
  formSubmitRequest(formData){

    wx.request({
      url: 'http://39.104.71.159:6602/bpmwechat/iYdejC/wxlogin', //仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        username: formData.name,
        password: formData.password,
        sms_verify_code:'0369',
        platform: "WEB_CLIENT"

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('res',res);
        if (res.data && res.data.code === 1) {
          const token = res.data.content.token;
          const userInfo = res.data.content.user_info;


          let app = getApp();
          app.globalData.userInfo = userInfo;

          wx.setStorage({
            key:"token",
            data:token,
            success(){
              wx.redirectTo({
                url:'/pages/dashborad/dashborad'
              })
            }
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
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const formData = e.detail.value;
    const verifyFormResult = this.verifyForm(formData);
    if(verifyFormResult.isVerify){
      this.formSubmitRequest(formData);
    }else{
      wx.showToast({
        title:verifyFormResult.errorMsg,
        icon:'none',
      })
      // wx.showModal({
      //   content: verifyFormResult.errorMsg,
      //   showCancel:false,
      // })
    }
  },
})
