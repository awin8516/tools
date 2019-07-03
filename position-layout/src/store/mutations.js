import { deepClone, mergeJSON } from "@/utils";

const mutations = {
  SET_STATE: (state, component) => {
    state = mergeJSON(state, component);
    //强制刷新页面
    state.elementList = component.elementList;
  },
  SET_SCREENSTYLE: (state, component) => {
    state.screenOptions.style = component;
  },
  SET_SCREENELEMENT: (state, component) => {
    state.screenOptions.el = component;
  },
  SET_ELEMENTLIST: (state, component) => {
    state.elementList = component;
  },
  SET_SELECTELEMENT: (state, component) => {
    state.elementList.map(v => (v.selected = false));
    state.elementList.find(v => v.vid === component.vid).selected = true;
    state.elementList = deepClone(state.elementList);
  },
  SET_SETSELECTELEMENT: (state, component) => {
    let element = state.elementList.find(v => v.selected)
    element = mergeJSON(element, component);
  },
  SET_CANCELACSELECTELEMENT: (state, component) => {
    if (component) {
      component.selected = false
      state.elementList = deepClone(state.elementList);
    }
  },
  SET_ADDELEMENT: (state, component) => {
    state.elementList.push(component)
  },
  SET_DELETEELEMENT: (state, component) => {
    let index = state.elementList.findIndex(v => v === component);
    state.elementList.splice(index, 1);
    if (state.elementList.length > 0) {
      state.elementList[state.elementList.length - 1].selected = true;
    }
  },
  SET_ADDSTYLE: (state, component) => {
    let element = state.elementList.find(v => v.selected)
    element.style = Object.assign({}, element.style, component);
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
