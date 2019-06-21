import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const state = {
  screen: null,
  screenOptions: {
    sizeList: {
      iphone4: {
        width: '320px',
        height: '414px'
      },
      iphone5: {
        width: '320px',
        height: '600px'
      },
      iphone6: {
        width: '375px',
        height: '667px'
      },
      iphone7: {
        width: '375px',
        height: '667px'
      },
      iphoneX: {
        width: '375px',
        height: '667px'
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
    }
  },
  elementList: [],
  ragneList: ['left', 'top', 'width', 'height']
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});

export default store;
