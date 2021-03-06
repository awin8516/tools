import { deepClone, formatElement, mergeJSON, styleSplit } from "@/utils";
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
  SET_DELETESCREENSTYLE: (state, component) => {
    if (typeof component == 'object') {
      component.forEach(style => {
        delete state.project.screenOptions.style[style]
      });
    } else {
      delete state.project.screenOptions.style[component]
    }
    state.project.screenOptions.style = deepClone(state.project.screenOptions.style);
  },
  SET_UPDATESCREENELEMENT: (state, component) => {
    state.default.screenOptions.el = component;
  },
  SET_UPDATETHEMECOLORS: (state, component) => {
    state.project.themeColors = component;
  },
  SET_ADDELEMENT: (state, component) => {
    component = deepClone(component);
    if (!component.style[state.project.mediaName]) {
      component.style[state.project.mediaName] = deepClone(component.style.default);
    }
    component.vid = new Date().getTime();
    component = formatElement(state.project, component);
    let elementSelected = state.project.elementList.find(v => v.selected);
    //子元素
    if (elementSelected) {
      //必须是container容器才能加子元素
      if (elementSelected.container) {
        component.pid = elementSelected.vid;
        state.project.elementList.push(component);
        state.project.elementList.map(v => (v.selected = false));
        component.selected = true
      } else {
        alert(MSG['not-container'])
      }
    } else {
      //顶层元素
      state.project.elementList.push(component);
      state.project.elementList.map(v => (v.selected = false));
      component.selected = true
    }
  },
  SET_DELETEELEMENT: (state, component) => {
    let index = state.project.elementList.findIndex(v => v === component);
    if (index !== undefined) {
      state.project.elementList.splice(index, 1);
      if (state.project.elementList.length > 0) {
        state.project.elementList[state.project.elementList.length - 1].selected = true;
      }
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
    element && mergeJSON(element, component);
  },
  SET_UPDATEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.project.elementList.find(v => v.vid == component.vid) : state.project.elementList.find(v => v.selected);
    element && mergeJSON(element.attribute, component);
  },
  SET_DELETEATTRIBUTE: (state, component) => {
    let element = state.project.elementList.find(v => v.selected);
    if (element) {
      if (typeof component == 'object') {
        component.forEach(attribute => {
          delete element.attribute[attribute]
        });
      } else {
        delete element.attribute[component]
      }
      state.project.elementList = deepClone(state.project.elementList);
    }
  },
  SET_REPLACEELEMENTATTR: (state, component) => {
    let element = component.vid ? state.project.elementList.find(v => v.vid == component.vid) : state.project.elementList.find(v => v.selected);
    if (element) {
      for (const key in component) {
        element.attribute[key] = component[key]
      }
    }
  },
  SET_UPDATEELEMENTSTYLE: (state, component) => {
    let element = state.project.elementList.find(v => v.selected);

    if (element) {
      const formatMarginPadding = (component) => {
        for (const key in component) {
          switch (key) {
            case 'margin':
              const margin = styleSplit(key, component[key])
              component["margin-top"] = margin.top
              component["margin-right"] = margin.right
              component["margin-bottom"] = margin.bottom
              component["margin-left"] = margin.left
              delete component.margin
              break;
            case 'padding':
              const padding = styleSplit(key, component[key])
              component["padding-top"] = padding.top
              component["padding-right"] = padding.right
              component["padding-bottom"] = padding.bottom
              component["padding-left"] = padding.left
              delete component.padding
              break;
          }
        }
        return component
      }
      // element.style[state.project.mediaName] = Object.assign({}, element.style[state.project.mediaName], formatMarginPadding(component));
      element.style[state.project.mediaName] = Object.assign({}, element.style[state.project.mediaName], component);
      state.project.elementList = deepClone(state.project.elementList);
    }
  },
  SET_DELETEELEMENTSTYLE: (state, component) => {
    let element = state.project.elementList.find(v => v.selected);
    if (element) {
      if (typeof component == 'object') {
        for (const key in element.style) {
          component.forEach(style => {
            delete element.style[key][style]
            if(style == 'position'){
              delete element.style[key].left
              delete element.style[key].top
              delete element.style[key].right
              delete element.style[key].bottom
            }
          });
        }
      } else {
        for (const key in element.style) {
          delete element.style[key][component]
          if(component == 'position'){
            delete element.style[key].left
            delete element.style[key].top
            delete element.style[key].right
            delete element.style[key].bottom
          }
        }
      }
      state.project.elementList = deepClone(state.project.elementList);
    }
  },
  SET_UPDATEELEMENTLAYER: (state, act) => {
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
  SET_UPDATEELEMENTOPTIONS: (state, component) => {
    let element = state.project.elementList.find(v => v.selected);
    if (element) {
      element.options = Object.assign({}, element.options, component);
      state.project.elementList = deepClone(state.project.elementList);
    }
  }
};

export default mutations;
