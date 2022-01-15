// pages/detail-songs/index.js
import {rankingStore} from '../../store/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      ranking:'',
      rankingInfo:{}
    },

    onLoad: function (options) {
      var {ranking} = options
      this.setData({ranking})
      rankingStore.onState(ranking,this.getRankingDataHandler)
    },
  
    onUnload: function () {
        rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    },
    getRankingDataHandler(res){
      this.setData({rankingInfo:res})
    }
})