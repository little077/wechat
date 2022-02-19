import YUANRequest from './index'
export function getHotSearch() {
    return YUANRequest.get('/search/hot')
}
export function getSuggestSearch(keywords) {
    return YUANRequest.get('/search/suggest',
    {
      keywords,
      type:"mobile",
    })
}
export function  searchReasult(keywords) {
  return YUANRequest.get('/search',{
    keywords,
  })
}