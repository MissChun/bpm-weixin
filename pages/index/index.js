import {
    httpServer
} from '../../api/request.js'

Page({
    onShareAppMessage() {
        return {
            title: 'form',
            path: 'page/component/pages/form/form'
        }
    },
    onLoad() {
        //如果已经登录则含有token,如果有token则为已登录，直接跳转到dashborad
        wx.getStorage({
            key: 'token',
            success(res) {
                if (res.data) {
                    wx.switchTab({
                        url: '/pages/dashborad/dashborad',
                    })
                }
            }
        })
    },
    data: {
        isSendAjax: false,
    },
    verifyForm(formData) {
        let verifyFormResult = {
            isVerify: true,
            errorMsg: '',
        };
        if (formData.name.length) {
            if (!formData.name.match(/^1\d{10}$/)) {
                verifyFormResult = {
                    isVerify: false,
                    errorMsg: '请填写正确的电话号码',
                };
                return verifyFormResult
            }
        } else {
            verifyFormResult = {
                isVerify: false,
                errorMsg: '请填写电话号码',
            };
            return verifyFormResult
        }

        if (!formData.password.length) {
            verifyFormResult = {
                isVerify: false,
                errorMsg: '请填写密码',
            };
            return verifyFormResult
        }

        return verifyFormResult;

    },
    formSubmitRequest(formData) {

        const postData = {
            username: formData.name,
            password: formData.password,
            platform: "WX_PROGRAM"
        }
        this.setData({
            isSendAjax: true
        })
        httpServer('login', postData).then(res => {
            this.setData({
                isSendAjax: false
            })
            if (res.data && res.data.code === 1) {
                const token = res.data.content.token;
                let userInfo = res.data.content.user_info;
                userInfo.company = res.data.content.user.profile.company;

                wx.setStorage({
                    key: "userInfo",
                    data: userInfo,
                })

                wx.setStorage({
                    key: "token",
                    data: token,
                    success() {
                        wx.switchTab({
                            url: '/pages/dashborad/dashborad',
                        })
                    }
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
    formSubmit(e) {
        const formData = e.detail.value;
        const verifyFormResult = this.verifyForm(formData);
        if (verifyFormResult.isVerify) {
            this.formSubmitRequest(formData);
        } else {
            wx.showToast({
                title: verifyFormResult.errorMsg,
                icon: 'none',
            })
        }
    },
})