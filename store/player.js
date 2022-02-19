//创建播放实例
const audioContext = wx.createInnerAudioContext()
import {HYEventStore} from 'hy-event-store'

const playStore = new HYEventStore({
	state:{},
	action:{},
})

export {audioContext,playStore}