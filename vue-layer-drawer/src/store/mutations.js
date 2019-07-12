import { deepClone, resetLayerName, mergeJSON } from "@/utils";
import MSG from "@/utils/message";

const mutations = {
  SET_STATE: (state, component) => {
    state = mergeJSON(state, component);
    //强制刷新页面
    state.themeColors = component.themeColors;
    state.elementList = component.elementList;
    console.log(state)
  },
  SET_UPDATEMEDIANAME: (state, component) => {
    state.elementList.map(v => {
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
  SET_UPDATETHEMECOLORS: (state, component) => {
    state.themeColors = component;
  },
  SET_ADDELEMENT: (state, component) => {
    if (!component.style[state.mediaName]) {
      component.style[state.mediaName] = deepClone(component.style.default);
    }
    // for(let key in state.screenOptions.sizeList){
    //   component.style[key] = deepClone(component.style.default);
    // }
    component.vid = new Date().getTime();
    component = resetLayerName(state, component);
    let elementSelected = state.elementList.find(v => v.selected);
    //子元素
    if (elementSelected) {
      //必须是container容器才能加子元素
      if (elementSelected.container) {
        component.pid = elementSelected.vid;
        state.elementList.push(component);
      } else {
        alert(MSG['not-container'])
      }
    } else {
      //顶层元素
      state.elementList.push(component);
    }
    // state.elementList.push(component);
  },
  SET_DELETEELEMENT: (state, component) => {
    let index = state.elementList.findIndex(v => v === component);
    state.elementList.splice(index, 1);
    if (state.elementList.length > 0) {
      state.elementList[state.elementList.length - 1].selected = true;
    }
  },
  SET_CLEARELEMENT: (state) => {
    state.elementList = []
  },
  SET_SELECTELEMENT: (state, component) => {
    const element = state.elementList.find(v => v.vid === component.vid)
    if (element) {
      state.elementList.map(v => (v.selected = false));
      element.selected = true
      state.elementList = deepClone(state.elementList);
    }
  },
  SET_CANCELACSELECTELEMENT: (state, component) => {
    if (component) {
      component.selected = false;
      state.elementList = deepClone(state.elementList);
    }
  },
  SET_UPDATEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.elementList.find(v => v.vid == component.vid) : state.elementList.find(v => v.selected);
    mergeJSON(element, component);
  },
  SET_REPLACEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.elementList.find(v => v.vid == component.vid) : state.elementList.find(v => v.selected);
    for (const key in component) {
      element[key] = component[key]
    }
  },
  SET_UPDATESTYLE: (state, component) => {
    let element = state.elementList.find(v => v.selected);
    const a = (component) => {
      for (const key in component) {
        switch (key) {
          case 'margin':
            component["margin-top"] = component[key]
            component["margin-right"] = component[key]
            component["margin-bottom"] = component[key]
            component["margin-left"] = component[key]
            delete component.margin
            break;
          case 'padding':
            component["padding-top"] = component[key]
            component["padding-right"] = component[key]
            component["padding-bottom"] = component[key]
            component["padding-left"] = component[key]
            delete component.padding
            break;
        }
      }
      return component
    }
    element.style[state.mediaName] = Object.assign({}, element.style[state.mediaName], a(component));
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
  },
  SET_REGISTERCONTEXTMENU: (state, menu) => {

  }
};

export default mutations;
