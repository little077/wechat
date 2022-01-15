let timer = null
export function antiSkake(time=50) {
  return  new Promise((resolve,reject)=>{
    clearTimeout(timer)
    timer =  setTimeout(()=>{
       const query = wx.createSelectorQuery()
       query.select('.swiper-image').boundingClientRect()
       query.exec(res=>{
         resolve(res[0].height)
        })
   },time)
  })
}