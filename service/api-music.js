import YUANRequest from './index'
export function getBanner(){
    return YUANRequest.get('/banner',{
        type:2,
    })
}
export function getRankings(idx) {
    return YUANRequest.get('/top/list',{
        idx,
    })  
}
//复用了两次
export function getSongMenu(cat="全部",limit = 6 ,offset =0){
  return YUANRequest.get("/top/playlist",{
      cat,
      limit,
      offset,
  })
}
export function getSongMenuDetail(id) {
    return YUANRequest.get("/playlist/detail/dynamic", {
      id,
    })
  }

  