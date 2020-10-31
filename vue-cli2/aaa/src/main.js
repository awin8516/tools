import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import './style/global.scss'
import "babel-polyfill";
import store from './store'//引入store
import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 设置全局的变量
import global_ from './components/common/Base.vue'
// 瀑布流
import { VueMasonryPlugin } from 'vue-masonry';
// 图表插件
import VCharts from 'v-charts'
import 'v-charts/lib/style.css';
// import VueAMap from 'vue-amap';
import utils from './utils/utils'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import '../src/icons/index.js' // icon

Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});


// Vue.use(VueAMap);
Vue.use(VCharts)
Vue.use(VueMasonryPlugin)
Vue.use(VueQuillEditor)
Vue.use(ElementUI, { size: 'small' });
// Vue.component(VeLine.name, VeLine)
Vue.prototype.$axios = axios;
Vue.prototype.$utils = utils;
Vue.prototype.GLOBAL = global_;
axios.defaults.baseURL = global_.BASE_URL;

// 测试环境的参数  便于开发
if (process.env.NODE_ENV == 'development') {
  // 开发环境
  localStorage.setItem("token", 'XtNKfKEw4q3xnP61yTK0xsVTEvDCMRLnsPSFmfG2sxU5C3m397s4xoaUpBlfCdyy');
  localStorage.setItem("status", '1');
  localStorage.setItem("menu", global_.MENUS);
  localStorage.setItem("avatar", 'https://scrmtest.beats-digital.com/pubavatar/qita.png');
  localStorage.setItem("name", 'BEATS彼邑');
  // d3g1NzA2YjFjMzQ0ZTdhOGZi
  // d3g2MDI3Y2QzMjJmOWE0ZDc1
  // d3gwMjc2ZTQzODExOTZkMzEw
  // d3hlMjI4M2JhMmFhNDY1ZGFj
  // d3g3Mzc4ZGNkMTM3Y2NlOTMz
  localStorage.setItem("reg", 'd3g2MDI3Y2QzMjJmOWE0ZDc1');
  localStorage.setItem("account", 'admin');
  localStorage.setItem("pid", '0');
  localStorage.setItem("pages", JSON.stringify({}));
}

axios.interceptors.response.use(response => {
  if (response.data.code == 402) {
    router.push("/");
    return response;
  } else if (response.data.code == 100012 || response.data.code == 401) {
    localStorage.clear();
    // router.push("/login");
    window.location.href = global_.DOMAIN + '#/login'
    return Promise.reject(response);
  } else {
    if (Boolean(localStorage.getItem("token")) && Boolean(localStorage.getItem('menu')) && (JSON.parse((localStorage.getItem('menu')))).length != 0) { // 判断是否有token
      return response;
    } else {
      // 如果菜单失效了  就重新在获取一次菜单
      this.$axios
        .post(this.GLOBAL.BASE_URL + "selectmenu", {
          appid: window.atob(localStorage.getItem('reg'))
        })
        .then(res => {
          if (res.data.code == 0) {
            localStorage.setItem("menu", JSON.stringify(res.data.data.menu));
            return response;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
    
  }
});

const whiteList = ['/login'];// 不重定向白名单
// router.beforeEach((to, from, next) => {
//     if (Boolean(localStorage.getItem("token")) && Boolean(localStorage.getItem('menu')) && (JSON.parse((localStorage.getItem('menu')))).length != 0) { // 判断是否有token
//         next()
//     } else {
//         if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
//             next()
//         } else {
//             localStorage.clear();
//             window.location.href = global_.DOMAIN + '#/login'
//         }
//     }
// });

router.afterEach((to, from) => {
  if (to.meta.title) {
    store.dispatch('setTitle', to.meta)
  }
})


new Vue({
  router,
  store,//使用store
  render: h => h(App)
}).$mount('#app');

if(module.hot){
  module.hot.accept()
}