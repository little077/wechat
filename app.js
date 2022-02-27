// app.js
import {getLoginCode,codeToToken,checkToken,checkSession} from './service/api-login'
App({
	  onLaunch() {
	  const info = wx.getSystemInfoSync()
	  this.globalData.screenWidth = info.screenWidth
	  this.globalData.screenHeight = info.screenHeight
	  this.globalData.statusBarHeight = info.statusBarHeight
	  
	  const deviceRadio = info.screenHeight / info.screenWidth
	  this.globalData.deviceRadio = deviceRadio
	  //默认让用户进行登录
	  this.denglu()
	 
	},
	globalData: {
	  screenWidth: 0,
	  screenHeight: 0,
	  statusBarHeight: 0,
	  navBarHeight: 44,
	  deviceRadio:0,
	},
	async denglu(){
		const token = wx.getStorageSync('token')
		//判断token有没有过期
		const checkResult = await checkToken() 
		const isSessionExpire = await checkSession()
		if(!token || checkResult.errorCode || ! isSessionExpire){
		  this.getCode()
		}
	},
	async	getCode(){
		const code = await	getLoginCode()
		const result = await codeToToken(code)
		const token = result.token 
		wx.setStorageSync('token', token)
		
		},
  })
  