//创建播放实例
const audioContext = wx.createInnerAudioContext()
import {getPlayer , getSongLyric} from "../service/api_player"
import {parseLyric} from '../utils/parse-lyric'
import {HYEventStore,} from 'hy-event-store'

const playStore = new HYEventStore({
	state:{
		id:0,
		currentSong:{},
		durationTime:0,
		lyric:[],

		currentTime:0,
	    currentLyricIndex:0,
		currentLyricText:"",
		playModeIndex:0
	},
	actions:{
		playMusicWithSongIdAction(ctx,{id}){
			ctx.id = id
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
		//播放的一些处理
		this.dispatch("setUpAudioContextListenerAction")
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
		    	// this.ctx.lyric = ctx.lyric[currentIndex]
		    	// this.ctx.currentLyricIndex  = currentIndex
				// this.ctx.currentLyricText = currentLyricText 
				const currentLyricInfo = ctx.lyric[currentIndex]
                ctx.currentLyricIndex = currentIndex
                ctx.currentLyricText = currentLyricInfo.text 
			}
			  })
		}
	},
})

export {audioContext,playStore}