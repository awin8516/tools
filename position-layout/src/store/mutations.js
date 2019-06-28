import { mergeJSON } from "@/utils";
const _ = require("lodash");

const mutations = {
  SET_STATE: (state, component) => {
    state = mergeJSON(state, component);
    //强制刷新页面
    state.elementList = component.elementList;

  },
  SET_SCREENOPTIONS: (state, component) => {
    state.screenOptions = component;
  },
  SET_ELEMENTLIST: (state, component) => {
    state.elementList = component;
  }
};

export default mutations;
