// pages/music-player/index.js
import {audioContext,playStore} from '../../store/index'
const playModeNames = ["order", "repeat", "random"]
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
	  
	  isSliderChanging: false,

	  sliderValue:0,
	  
	  playModeIndex: 0,
	  playModeName: "order",
	  
	  lyricScrollTop:0,
     //歌曲是否正在播放
	  isPlaying:false
	  
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//拿到歌曲id
	  const {id} =options
	  this.setData({id})
      audioContext.onSeeking(()=>{
		console.log("跳转之前")
	})
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
		const value = e.detail.value

		// 2.计算需要播放的currentTIme
		const currentTime = this.data.durationTime * value / 100
	
		// 3.设置context播放currentTime位置的音乐
		// audioContext.pause()
		audioContext.seek(currentTime / 1000)
	
		// 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
		this.setData({ sliderValue: value, isSliderChanging: false })
	},
	// 滑块滑动处理
    handleSliderChangeing(e){
	
		const value = e.detail.value
		const currentTime = this.data.durationTime * value / 100
		this.setData({ isSliderChanging: true, currentTime })
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
	  playStore.onStates(["playModeIndex","isPlaying"],({playModeIndex,isPlaying})=>{
		 if(playModeIndex!==undefined){
			this.setData({playModeIndex,playModeName:playModeNames[playModeIndex]})
		 }
		 if (isPlaying !== undefined){
		this.setData({isPlaying:isPlaying})
		 }
	  })
	},
	backPage(){
		wx.navigateBack() 
	},
	//模式切换事件
	modeChange(){
	   let playModeIndex = this.data.playModeIndex+1
	   if(playModeIndex===3)   playModeIndex = 0
	   playStore.setState("playModeIndex",playModeIndex)
	},
	//播放暂停事件
	btnClick(){
		playStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
	},
	//上一首
	prevPlayMusic(){
		playStore.dispatch("prevplay") 
	},
	//下一首
	nextPlayMusic(){
		playStore.dispatch("nextplay")
	}
})