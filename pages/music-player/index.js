// pages/music-player/index.js
import {audioContext,playStore} from '../../store/index'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	  id:undefined,

	  currentSong:{},
	  lyric:"",
	  durationTime:0,

	  currentTime:0,
	  currentLyricIndex:0,
	  currentLyricText:"",

	  currentPage: 0,
	  contentHeight: 0,
	  isMusicLyric:true,
	  
	  
	  sliderValue:0,
	  
	  
	  
	  lyricScrollTop:0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//拿到歌曲id
	  const {id} =options
	  this.setData({id})

	  this.setUpPlayerStoreListener()

	   // 动态计算内容高度
	   const globalData = getApp().globalData
	   const deviceRadio = globalData.deviceRadio
	   const screenHeight = globalData.screenHeight
	   const statusBarHeight = globalData.statusBarHeight
	   const navBarHeight = globalData.navBarHeight
	   const contentHeight = screenHeight - statusBarHeight - navBarHeight
	   this.setData({ contentHeight ,isMusicLyric: deviceRadio >= 2 })
	
	
	},
	// 事件处理
	handleSwiperChange: function(event) {
		const current = event.detail.current
		this.setData({ currentPage: current })
	  },
	//   滑块点击处理
	handleSliderChange(e){
		  //计算点击滑块时期望的currentTime与记录当前进度
		const value = e.detail.value
		const currentTime = this.data.durationTime * value / 100
		//滑块点击时先暂停，不然可能会有bug
		audioContext.pause()
		// 切换到点击后的进度播放
		audioContext.seek(currentTime/1000)
		this.setData({sliderValue:value})
		
	},
	// 滑块滑动处理
    handleSliderChangeing(e){
		//先暂停不然会有滑动bug(和设计有关)
		audioContext.pause()
		const value =e.detail.value
		const currentTime= this.data.durationTime *value /100
		this.setData({currentTime,sliderValue: value})
	},
    setUpPlayerStoreListener(){
		// 监听durationTime','lyric','currentSong'变化
       playStore.onStates(['durationTime','lyric','currentSong'],({durationTime,lyric,currentSong})=>{
		   if(durationTime) this.setData({durationTime})
		   if(currentSong) this.setData({currentSong})
		   if(lyric) this.setData({lyric})
	   })
	     // 2.监听currentTime/currentLyricIndex/currentLyricText
		 playStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
			currentTime,
			currentLyricIndex,
			currentLyricText
		  }) => {
			// 时间变化
			if (currentTime && !this.data.isSliderChanging) {
			  const sliderValue = currentTime / this.data.durationTime * 100
			  this.setData({ currentTime, sliderValue })
			}
			// 歌词变化
			if (currentLyricIndex) {
			  this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
			}
			if (currentLyricText) {
			  this.setData({ currentLyricText })
			}
		  })
	  
	},
	backPage(){
		wx.navigateBack() 
	}
})