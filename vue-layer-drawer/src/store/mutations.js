import { deepClone, mergeJSON } from "@/utils";

const mutations = {
  SET_STATE: (state, component) => {
    state = mergeJSON(state, component);
    //强制刷新页面
    state.elementList = component.elementList;
    console.log(state)
  },
  SET_UPDATEMEDIANAME: (state, component) => {
    state.elementList.some(v => {
      if (!v.style[component]) {
        v.style[component] = deepClone(v.style[state.mediaName]);
      }
    });
    state.mediaName = component;
    state.screenOptions.style.width =
      state.screenOptions.sizeList[component].width;
    state.screenOptions.style.height =
      state.screenOptions.sizeList[component].height;
  },
  SET_UPDATESCREENATTR: (state, component) => {
    mergeJSON(state.screenOptions, component);
  },
  SET_UPDATESCREENSTYLE: (state, component) => {
    state.screenOptions.style = Object.assign({}, state.screenOptions.style, component);
  },
  SET_UPDATESCREENELEMENT: (state, component) => {
    state.screenOptions.el = component;
  },
  SET_SELECTELEMENT: (state, component) => {
    state.elementList.map(v => (v.selected = false));
    state.elementList.find(v => v.vid === component.vid).selected = true
    state.elementList = deepClone(state.elementList);
  },
  SET_CANCELACSELECTELEMENT: (state, component) => {
    if (component) {
      component.selected = false;
      state.elementList = deepClone(state.elementList);
    }
  },
  SET_ADDELEMENT: (state, component) => {
    if (!component.style[state.mediaName]) {
      component.style[state.mediaName] = deepClone(component.style.default);
    }
    // for(let key in state.screenOptions.sizeList){
    //   component.style[key] = deepClone(component.style.default);
    // }
    state.elementList.push(component);
  },
  SET_DELETEELEMENT: (state, component) => {
    let index = state.elementList.findIndex(v => v === component);
    state.elementList.splice(index, 1);
    if (state.elementList.length > 0) {
      state.elementList[state.elementList.length - 1].selected = true;
    }
  },
  SET_UPDATEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.elementList.find(v => v.vid == component.vid) : state.elementList.find(v => v.selected);
    mergeJSON(element, component);
  },
  SET_UPDATESTYLE: (state, component) => {
    let element = state.elementList.find(v => v.selected);
    element.style[state.mediaName] = Object.assign({}, element.style[state.mediaName], component);
  },
  SET_UPDATELAYER: (state, act) => {
    const index = state.elementList.findIndex(item => item.selected);
    if (index + act >= state.elementList.length - 1) {
      //置顶
      const _this = state.elementList[index];
      state.elementList.splice(index, 1);
      state.elementList = [...state.elementList, _this];
    } else if (index + act <= 0) {
      //置底
      const _this = state.elementList[index];
      state.elementList.splice(index, 1);
      state.elementList = [_this, ...state.elementList];
    } else {
      //上下移
      const _this = state.elementList[index];
      const _that = state.elementList[index + act];
      state.elementList[index] = _that;
      state.elementList[index + act] = _this;
    }
  }
};

export default mutations;
