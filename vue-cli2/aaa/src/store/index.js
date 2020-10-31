import Vue from 'vue';
import Vuex from 'vuex';
// 引入 axios
import axios from 'axios'
Vue.use(Vuex);

const state = {
  query: 'appid',
  route:'',
  
}

const getters = {
  showQuery() {
    let appid = window.atob(localStorage.getItem('reg'))
    return appid;
  },
  
}

const mutations = {
  setTitle(state,route){
    state.route = route
  },
}

const actions = {
  setTitle(context,route){
    context.commit('setTitle',route)
  },
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});


export default store;