import YUANRequest from './index'
export function getPlayer(ids){
	return YUANRequest.get("/song/detail",{
		ids
	})
}