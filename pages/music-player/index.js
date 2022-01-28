// pages/music-player/index.js
import {getPlayer} from "../../service/api_player"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	  id:undefined,
	  currentSong:{},
	  currentPage: 0,
      contentHeight: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//拿到歌曲id
	  const {id} =options
	  this.setData({id})
	  getPlayer(id).then(res=>{
		  this.setData({currentSong:res.songs[0]})
	  })
	   // 动态计算内容高度
	   const globalData = getApp().globalData
	   const screenHeight = globalData.screenHeight
	   const statusBarHeight = globalData.statusBarHeight
	   const navBarHeight = globalData.navBarHeight
	   const contentHeight = screenHeight - statusBarHeight - navBarHeight
	   this.setData({ contentHeight })
	     // 4.创建播放器
		 const audioContext = wx.createInnerAudioContext()
		 audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		 audioContext.play()
	},
	// 事件处理
	handleSwiperChange: function(event) {
		const current = event.detail.current
		this.setData({ currentPage: current })
	  },

})