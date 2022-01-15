import YUANRequest from './index'

export function getTopMV(offset,limit=10){
 return YUANRequest.get('/top/mv',{
      offset,
      limit
  })
}
/**
 * MV地址
 * @param {id} number 
 */
export function getMVURL(id) {
  return YUANRequest.get('/mv/url',{
    id
  })}
/**
 * 详情MV
 * @param {id} number
 */
export function getMVDetail(mvid) {
  return YUANRequest.get('/mv/detail',{
    mvid
  })
}
/**
 * 获取相关视频
 * @param {id} number 
 */
export function getRelat(id) {
  return YUANRequest.get('/related/allvideo',{
    id
  })
}

