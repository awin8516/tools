const mutations = {
  SET_SCREEN: (state, component) => {
    state.screen = component;
  },
  SET_SCREENOPTIONS: (state, component) => {
    state.screenOptions = component;
  },
  SET_ELEMENTLIST: (state, component) => {
    state.elementList = component;
  }
};

export default mutations;
