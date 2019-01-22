//app.js
import gio from './utils/gio-minp';
// version 是你的小程序的版本号
//gio('init', '你的 GrowingIO 项目ID', '你的微信小程序的 AppID', { version: '1.0' });
gio('init', '9d7dd20849824040', 'wx5d17f938a41b3254', {
  version: '0.23',
  followShare: true
});
App({
  onLaunch: function (options) {
  	console.log('options',options);
  },
  globalData: {
    userInfo: null
  }
})