  import {getTopMV} from '../../service/api_video'
Page({

    data: {
        topMVs:[],
        hasMore:true,
    },
    //类似与create生命周期
    onLoad(options) {
      this.getTopMVData(0)
     },
     //其他生命周期
     onPullDownRefresh(){
      this.getTopMVData(0)
    },
    //下拉到底部生命周期
     onReachBottom(){
      this.getTopMVData(this.data.topMVs.length)
    },
    //封装网络模块
   async getTopMVData(offset){

    //判断
   if(!this.data.hasMore&&offset!==0) return
   
   wx.showNavigationBarLoading()

   let res = await getTopMV(offset)
   let newMVData = this.data.topMVs
   if(offset==0){
     newMVData = res.data
   }
   else{
     newMVData = this.data.topMVs.concat(res.data)
   }
   this.setData({topMVs:newMVData,hasMore:res.hasMore})
   wx.hideNavigationBarLoading()
   if(offset==0){
     wx.stopPullDownRefresh()
   }
  },
  //事件模块
  getID(e){
    let {id} = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/detail-video/index?id='+id
    })
  }
})