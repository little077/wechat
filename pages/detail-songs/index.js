// pages/detail-songs/index.js
import {rankingStore} from '../../store/index'
import {getSongMenuDetail} from '../../service/api-music'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      ranking:'',
      detailInfo:{},
       type:'',
    },

    onLoad: function (options) {
      let {type} = options
      this.setData({type})
      if(type==='menu'){
        getSongMenuDetail(options.id).then(res=>{
          this.setData({detailInfo:res.playlist})
        })
      }else if(type==='rank'){
        var {ranking} = options
      this.setData({ranking})
      rankingStore.onState(ranking,this.getRankingDataHandler)
      }
    },
  
    onUnload: function () {
      if(this.data.ranking){
        rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
      }
    },
    getRankingDataHandler(res){
      this.setData({detailInfo:res})
    }
})