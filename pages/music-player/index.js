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

	  currentPage: 0,
	  contentHeight: 0,
	  isMusicLyric:true,
	  
	  currentTime:0,
	  sliderValue:0,
	  
	  currentLyricIndex:0,
	  currentLyricText:"",
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
		//  播放器 
		audioContext.stop()
		audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		audioContext.autoplay = true
		audioContext.onCanplay(()=>{
		  audioContext.play()
		})
		//更新时间处理
	    audioContext.onTimeUpdate(()=>{
		//得到当前播放时间
		const currentTime = (audioContext.currentTime * 1000)
		//初始化更新时间和value
		const sliderValue = (currentTime / this.data.durationTime * 100)
		this.setData({sliderValue,currentTime})
		
	  // 根据当前时间去查找播放的歌词
	  if(!this.data.lyric.length) return
      let i = 0
      for (; i < this.data.lyric.length; i++) {
        const lyricInfo = this.data.lyric[i]
        if (currentTime < lyricInfo.time) {
          break
        }
      }
      // 设置当前歌词的索引和内容
	  const currentIndex = i - 1
	 
      if (this.data.currentLyricIndex !== currentIndex) {
        const currentLyricInfo = this.data.lyric[currentIndex]
		this.setData({ currentLyricText: currentLyricInfo.text,          currentLyricIndex: currentIndex,
		lyricScrollTop:currentIndex*35})
      }
		})
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
       playStore.onStates(['durationTime','lyric','currentSong'],(res)=>{
		   console.log(res)
	   })
	}
})