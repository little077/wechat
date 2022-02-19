import YUANRequest from './index'
export function getPlayer(ids){
	return YUANRequest.get("/song/detail",{
		ids,
	})
}
export function  getSongLyric(id) {
	return YUANRequest.get("/lyric",{
		id,
		
	})
}