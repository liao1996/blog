import axios from 'axios'
import md5 from 'js-md5';
//获取歌词
export const getWords=(id)=>{
    return axios.get(`api/lyric?id=${id}`);
}
//登录
export const loginMusic=()=>{
    return axios.get(`api/login/cellphone?phone=13036127695&password=''&md5_password=${md5('liao1996Z..')}`);
}
//获取歌曲详情
export const getMusicInfo=(id)=>{
    return axios.get(`api/song/detail?ids=${id}`);
}
//获取歌曲url
export const getMusicUrl=(id)=>{
    return axios.get(`api/song/url?id=${id}`);   
}
//获取热门歌曲
export const getHotMusic=(id)=>{
    return axios.get(`api/playlist/detail?id=${id}`);
}
//获取搜索建议
export const getSearchSuggest=(key)=>{
    return axios.get(`api/search/suggest?keywords=${key}`)
}