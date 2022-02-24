//创建播放实例
const audioContext = wx.createInnerAudioContext()
import {getPlayer , getSongLyric} from "../service/api_player"
import {parseLyric} from '../utils/parse-lyric'
import {HYEventStore,} from 'hy-event-store'
import {randomNum} from '../utils/randomMath'
const playStore = new HYEventStore({
	state:{

		isFirstPlay:true,

		id:0,
		currentSong:{},
		durationTime:0,
		lyric:[],

		currentTime:0,
	    currentLyricIndex:0,
		currentLyricText:"",

		playModeIndex:0, //记录播放模式 0 循环 1 单曲 2 随机
		playList:[], //列表
		playListIndex:0, //列表索引

		isPlaying:true  
	},
	actions:{
		playMusicWithSongIdAction(ctx,{id,isid=true}){
			if(isid) 	{if(ctx.id == id) return}
			ctx.id = id
			ctx.isPlaying = true
			//清除上一次的缓存
			ctx.currentSong = {}
			ctx.durationTime = 0
			ctx.lyric = []
			ctx.currentTime = 0
			ctx.currentLyricIndex = 0
			ctx.currentLyricText = ''
			// 请求歌曲详情
			getPlayer(id).then(res=>{
				ctx.currentSong = res.songs[0]
				ctx.durationTime = res.songs[0].dt
			})
			//拿到歌词
			getSongLyric(id).then(res=>{
				const lyricc =res.lrc.lyric
				const lyrics = parseLyric(lyricc)
				ctx.lyric = lyrics
			    
			})
		//  播放器 
		audioContext.stop()
		audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		audioContext.autoplay = true
		//播放的一些处理因为用到的是同一个audioContext对象，所以派发一次
        if(ctx.isFirstPlay){
		this.dispatch("setUpAudioContextListenerAction")
		ctx.isFirstPlay = false
		}

		 //派发出当前播放的歌曲，形成列表
		this.dispatch("setPlayList",id)
		},
		setUpAudioContextListenerAction(ctx){
			audioContext.onCanplay(()=>{
				audioContext.play()
			  })
			  //更新时间处理
			  audioContext.onTimeUpdate(()=>{
			  //得到当前播放时间
			  const currentTime = (audioContext.currentTime * 1000)
			  //初始化更新时间和value
			  ctx.currentTime = currentTime
			// 根据当前时间去查找播放的歌词
			if(!ctx.lyric.length) return
			let i = 0
			for (; i < ctx.lyric.length; i++) {
			  const lyricInfo = ctx.lyric[i]
			  if (currentTime < lyricInfo.time) {
				break
			  }
			}
			// 设置当前歌词的索引和内容
			const currentIndex = i - 1
		    
			if (ctx.currentLyricIndex !== currentIndex) {
				const currentLyricInfo = ctx.lyric[currentIndex]
                ctx.currentLyricIndex = currentIndex
                ctx.currentLyricText = currentLyricInfo.text 
			}
			  })
              audioContext.onEnded(()=>{
				  if(ctx.playModeIndex==1){
                    this.dispatch("playMusicWithSongIdAction",{id:ctx.id,isid:false})
				  }
				  if(ctx.playModeIndex == 2){
					  this.dispatch("nextplay")
				  }
				  if(ctx.playList.length === 1 ){
					this.dispatch("playMusicWithSongIdAction",{id:ctx.id,isid:false})
				  }
				  this.dispatch("playMusicWithSongIdAction",{id:ctx.id,isid:false})
			  })
		},
		changeMusicPlayStatusAction(ctx,isPlaying = true) {
			ctx.isPlaying = isPlaying
			ctx.isPlaying ? audioContext.play(): audioContext.pause()
		  },
		async  setPlayList(ctx,id){
			function unique(arr) {
				let newMap = new Map()
				let result = []
				arr.forEach((element) => {
				newMap.set(element.id, element)
				})
				newMap.forEach((value, key) => {
				result.push(value)
				})
			 return result
			}
			let newarr = [...ctx.playList]
			let res =  await	getPlayer(id)
			let currentSong = res.songs[0]
		    newarr.push(currentSong)
	     	
		ctx.playList = unique(newarr)
        for(let i =0 ;i <ctx.playList.length; i ++){
			if( ctx.playList[i].id===ctx.id){
				ctx.playListIndex = i
			}
		}
	  },
	  //这一段太完美了
	  nextplay(ctx){
		let index =ctx.playListIndex
		let length = ctx.playList.length
		switch(ctx.playModeIndex){
		  case 0 :
			ctx.playListIndex = index +1
			if(ctx.playListIndex === length) ctx.playListIndex = 0
			break
		  case 1 :
			break
		  case 2 :
			ctx.playListIndex = randomNum(0,length-1)
			break
		}
		if(ctx.playList[ctx.playListIndex].id == ctx.id) return
		this.dispatch("playMusicWithSongIdAction",{id:ctx.playList[ctx.playListIndex].id})
		
	  },
	  prevplay(ctx){ 
		let index =ctx.playListIndex
		let length = ctx.playList.length
		switch(ctx.playModeIndex){
		  case 0 :
			ctx.playListIndex = index -1
			if(ctx.playListIndex === -1) ctx.playListIndex = ctx.playList.length-1
			break
		  case 1 :
			break
		  case 2 :
			ctx.playListIndex = randomNum(0,length-1)
			break
		}
		if(ctx.playList[ctx.playListIndex].id == ctx.id) return
		this.dispatch("playMusicWithSongIdAction",{id:ctx.playList[ctx.playListIndex].id})
	  },
	}, 
})

export {audioContext,playStore}