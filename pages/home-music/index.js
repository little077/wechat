// pages/home-music/index.js
import {playStore} from '../../store/player'
import {getBanner,getSongMenu, playerStore} from '../../service/api-music'
import {antiSkake} from '../../utils/antiskake'
import {rankingStore,rankingMap} from '../../store/index'


Page({

    /**
     * 页面的初始数据
     */
    data: {
      banners:[],
      swiperHeight:0,
      recommendSongs:[],
      hotSongMenu:[],
      recommendSongMenu:[],
      rankings: { 0: {}, 2: {}, 3: {} },

      currentSong: {},
      isPlaying: false,
      playAnimState: "paused"
    },
     
    onLoad: function (options) {
      playStore.dispatch("playMusicWithSongIdAction",{id:1901371647})
      getBanner().then(res=>{
        this.setData({banners:res.banners})
      })
      getSongMenu().then(res=>{
        this.setData({hotSongMenu:res.playlists})
      })
      getSongMenu("华语").then(res=>{
        this.setData({recommendSongMenu:res.playlists})
      })
      rankingStore.dispatch("getRankingDataAction")
      
      rankingStore.onState("hotRanking",(res)=>{
        if(! res.tracks) return  
        const  recommendSongs = res.tracks.slice(0,6)
        this.setData({recommendSongs})
      })
      rankingStore.onState("newRanking", this.getRankingHandler(0))
      rankingStore.onState("originRanking", this.getRankingHandler(2))
      rankingStore.onState("upRanking", this.getRankingHandler(3))
       // 2.播放器监听
    playStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying, 
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
    })
    },
    searchSkip(){
      wx.navigateTo({
        url: '/pages/detail-search/index',
      })
    },
    async imageload(){
      this.setData({
        swiperHeight:await antiSkake()
      })
   },

   getRankingHandler: function(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}
      this.setData({ 
        rankings: newRankings
      }) 
    }
  },
  handMoreClick(){
    this.navigateToDetailSongs("hotRanking")
  },
  handleRankingItemClick(event){
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongs(rankingName)
  },
  navigateToDetailSongs(rankingName){
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  handlePlayBtnClick: function() {
    playStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
}) 