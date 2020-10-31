import axios from 'axios';
import qs from 'qs';
import https from '../components/common/Base.vue'

let appid;

axios.defaults.baseURL = https.BASE_URL;

axios.interceptors.request.use(function (config) {
    config.data.appid = appid;
    qs.stringify(config.data)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    // window.console.log(response,'axios-response')
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

const API = {
    changeAppid: function (str){
        appid = str;
    },
    //修改流程状态
    edit: function (data){
        return axios.post('process/edit',data)
    },
    //获取流程列表
    list: function (data){
        return axios.post('process/list',data)
    },
    //添加新流程
    add: function (data){
        return axios.post('process/add',data)
    },
    //保存流程
    save: function (data){
        return axios.post('process/save',data)
    },
    //获取流程数据
    detail: function (data){
        return axios.post('process/detail',data)
    },
    //自定义标签列表
    getalldiytag: function (data){
      return axios.post('getalldiytag',data)
    },
    //微信标签列表
    biao_qian_fen_list: function(data){
      return axios.post('biao_qian_fen_list',data)
    },
    //短信签名
    smssign: function(data){
      return axios.post('smssign',data)
    },
    //短信模版
    smslist: function(data){
      return axios.post('smslist',data)
    },
    //模版消息
    templatelist: function(data){
      return axios.post('templatelist',data)
    },
    //外链图文
    melink: function(data){
      return axios.post('melink',data)
    },
    //视频
    mevideo: function(data){
      return axios.post('mevideo',data)
    },
    //音频
    mevoice: function(data){
      return axios.post('mevoice',data)
    },
    //图文
    meimgtext: function(data){
      return axios.post('meimgtext',data)
    },
    //图片
    meimg: function(data){
      return axios.post('meimg',data)
    },
}

export default API;