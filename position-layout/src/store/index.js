import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const state = {
  screenOptions: {
    sizeList: {
      iphone4: {
        width: '320px',
        height: '416px'
      },
      iphone5: {
        width: '320px',
        height: '504px'
      },
      iphone6: {
        width: '375px',
        height: '603px'
      },
      iphone6Plus: {
        width: '414px',
        height: '672px'
      },
      iphone7: {
        width: '375px',
        height: '667px'
      },
      iphoneX: {
        width: '375px',
        height: '812px'
      }
    },
    style: {
      name:'index',
      width: '',
      height: '',
      'background-image': 'url()',
      'background-color': '#fff',
      'background-repeat': 'no-repeat',
      'background-size': '100% auto',
      'background-position': 'left top'
    },
    el:null
  },
  elementList: [],
  positionOptions: ['relative', 'absolute', 'fixed'],
  ragneList: ['left', 'top', 'width', 'height', 'margin-left', 'margin-top']
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});

export default store;
