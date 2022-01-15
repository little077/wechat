// pages/detail-video/index.js
import {getMVURL,getMVDetail,getRelat} from '../../service/api_video'
Page({
   
    /**
     * 页面的初始数据
     */
    data: {
      mvURLInfo:{},
      mvDetail:{},
      relatedVideos:[],
      danmuList:[{
      text: '做的第一个小程序啦~',
      color: '#ff0000',
      time: 1
    }],
    },
    getData(id){
      getMVURL(id).then(res=>{
        this.setData({mvURLInfo:res.data})
      }),
     getMVDetail(id).then(res=>{
       this.setData({mvDetail:res.data})
     })
      getRelat(id).then(res=>{
        this.setData({relatedVideos:res.data})
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let id =parseInt(options.id)
      this.getData(id)
    },
  

})