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
	},
	action:{
		playMusicWithSongIdAction(ctx,{id}){
			ctx.id = id
			// 请求歌曲详情
			getPlayer(id).then(res=>{
				ctx.currentSong = res.songs[0]
				ctx.durationTime = res.songs[0].dt
			})
			//拿到歌词
			getSongLyric(id).then(res=>{
				const lyric =res.lrc.lyric
				const lyrics = parseLyric(lyric)
				ctx.lyric = lyrics
			    
			})
		}
	},
})

export {audioContext,playStore}