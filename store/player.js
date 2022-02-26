//创建播放实例
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()
import {getPlayer , getSongLyric} from "../service/api_player"
import {parseLyric} from '../utils/parse-lyric'
import {HYEventStore,} from 'hy-event-store'
import {randomNum} from '../utils/randomMath'
const playStore = new HYEventStore({
	state:{

		isFirstPlay:true,
		isShoping:false,

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
			//因为牵扯到单曲循环，但是考虑到用户使用，点击同一首歌曲默认是为不重新播放
		   //但是单曲循环和列表数据为1的时候情况，就加入isid来进行判断是否重新播放
		   //这里可能对性能做的很差
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
				audioContext.title = res.songs[0].name
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
		audioContext.title = '有little快乐'
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
			  //歌曲播放完成的监听
              audioContext.onEnded(()=>{
				  //单曲就传isid为false进入播放	  //  
				   //考虑到列表只有一个，三种模式也就无所谓了，直接重新播放
				  if(ctx.playModeIndex==1||ctx.playList.length === 1 ){
					this.dispatch("playMusicWithSongIdAction",{id:ctx.id,isid:false})}
				//   //随机音乐的处理
				  if(ctx.playModeIndex == 2){
					  this.dispatch("nextplay")
				  } 
				//   顺序处理
				if(ctx.playModeIndex==0){  this.dispatch("nextplay")
				console.log(ctx.playListIndex)}
			  })
			  audioContext.onPlay(()=>{
                ctx.isPlaying = true
			  })
			  audioContext.onPause(()=>{
                ctx.isPlaying = false
			  })
			  audioContext.onStop(()=>{
				  ctx.isPlaying = false
				  ctx.isShoping = true
			  })
		},
		changeMusicPlayStatusAction(ctx,isPlaying = true) {
			ctx.isPlaying = isPlaying
			if (ctx.isPlaying && ctx.isStoping) {
				audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
				audioContext.title = currentSong.name
			  }
			  ctx.isPlaying ? audioContext.play(): audioContext.pause()
			  if (ctx.isStoping) {
				audioContext.seek(ctx.currentTime)
				ctx.isStoping = false
			  }
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
			this.dispatch("playMusicWithSongIdAction",{id:ctx.playList[ctx.playListIndex].id})
			break
		  case 1 :
			this.dispatch("playMusicWithSongIdAction",{id:ctx.playList[ctx.playListIndex].id})
			break
		  case 2 :
			ctx.playListIndex = randomNum(0,length-1)
			this.dispatch("playMusicWithSongIdAction",{id:ctx.playList[ctx.playListIndex].id,isid:false})
			break
		}
		// if(ctx.playList[ctx.playListIndex].id == ctx.id) return
		
		
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