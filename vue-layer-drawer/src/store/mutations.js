import { deepClone, resetLayerName, mergeJSON } from "@/utils";
import MSG from "@/utils/message";

const mutations = {
  SET_PROJECT: (state, component) => {
    state.project = component
    // state = mergeJSON(state, component);
    // //强制刷新页面
    // state.project.themeColors = component.themeColors;
    // state.project.elementList = component.elementList;
    // console.log(state)
  },
  SET_UPDATEMEDIANAME: (state, component) => {
    state.project.elementList.map(v => {
      if (!v.style[component]) {
        v.style[component] = deepClone(v.style[state.project.mediaName]);
      }
    });
    state.project.mediaName = component;
    state.project.screenOptions.style.width =
      state.project.screenOptions.sizeList[component].width;
    state.project.screenOptions.style.height =
      state.project.screenOptions.sizeList[component].height;
  },
  SET_UPDATESCREENATTR: (state, component) => {
    mergeJSON(state.project.screenOptions, component);
  },
  SET_UPDATESCREENSTYLE: (state, component) => {
    state.project.screenOptions.style = Object.assign({}, state.project.screenOptions.style, component);
  },
  SET_UPDATESCREENELEMENT: (state, component) => {
    state.default.screenOptions.el = component;
  },
  SET_UPDATETHEMECOLORS: (state, component) => {
    state.project.themeColors = component;
  },
  SET_ADDELEMENT: (state, component) => {
    if (!component.style[state.project.mediaName]) {
      component.style[state.project.mediaName] = deepClone(component.style.default);
    }
    // for(let key in state.screenOptions.sizeList){
    //   component.style[key] = deepClone(component.style.default);
    // }
    component.vid = new Date().getTime();
    component = resetLayerName(state.project, component);
    let elementSelected = state.project.elementList.find(v => v.selected);
    //子元素
    if (elementSelected) {
      //必须是container容器才能加子元素
      if (elementSelected.container) {
        component.pid = elementSelected.vid;
        state.project.elementList.push(component);
      } else {
        alert(MSG['not-container'])
      }
    } else {
      //顶层元素
      state.project.elementList.push(component);
    }
    // state.elementList.push(component);
  },
  SET_DELETEELEMENT: (state, component) => {
    let index = state.project.elementList.findIndex(v => v === component);
    state.project.elementList.splice(index, 1);
    if (state.project.elementList.length > 0) {
      state.project.elementList[state.project.elementList.length - 1].selected = true;
    }
  },
  SET_CLEARPROJECT: (state) => {
    state.project = deepClone(state.default)
  },
  SET_SELECTELEMENT: (state, component) => {
    const element = state.project.elementList.find(v => v.vid === component.vid)
    if (element) {
      state.project.elementList.map(v => (v.selected = false));
      element.selected = true
      state.project.elementList = deepClone(state.project.elementList);
    }
  },
  SET_CANCELACSELECTELEMENT: (state, component) => {
    if (component) {
      component.selected = false;
      state.project.elementList = deepClone(state.project.elementList);
    }
  },
  SET_UPDATEELEMENT: (state, component) => {
    let element = component.vid ? state.project.elementList.find(v => v.vid == component.vid) : state.project.elementList.find(v => v.selected);
    mergeJSON(element, component);
  },
  SET_UPDATEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.project.elementList.find(v => v.vid == component.vid) : state.project.elementList.find(v => v.selected);
    mergeJSON(element.attribute, component);
  },
  SET_REPLACEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.project.elementList.find(v => v.vid == component.vid) : state.project.elementList.find(v => v.selected);
    for (const key in component) {
      element.attribute[key] = component[key]
    }
  },
  SET_UPDATESTYLE: (state, component) => {
    let element = state.project.elementList.find(v => v.selected);
    const formatMarginPadding = (component) => {
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
    element.style[state.project.mediaName] = Object.assign({}, element.style[state.project.mediaName], formatMarginPadding(component));
    state.project.elementList = deepClone(state.project.elementList);
  },
  SET_UPDATELAYER: (state, act) => {
    const index = state.project.elementList.findIndex(item => item.selected);
    if (index + act >= state.project.elementList.length - 1) {
      //置顶
      const _this = state.project.elementList[index];
      state.project.elementList.splice(index, 1);
      state.project.elementList = [...state.project.elementList, _this];
    } else if (index + act <= 0) {
      //置底
      const _this = state.project.elementList[index];
      state.project.elementList.splice(index, 1);
      state.project.elementList = [_this, ...state.project.elementList];
    } else {
      //上下移
      const _this = state.project.elementList[index];
      const _that = state.project.elementList[index + act];
      state.project.elementList[index] = _that;
      state.project.elementList[index + act] = _this;
    }
  },
  SET_REGISTERCONTEXTMENU: (state, menu) => {
    state.contextMenu = state.contextMenu.concat(menu)
    console.log(state.contextMenu)
  }
};

export default mutations;
