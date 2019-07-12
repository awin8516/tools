const getters = {
  gt_screenOptions(state) {
    return state.screenOptions;
  },
  gt_elementList(state) {
    return state.elementList;
  },
  gt_elementSelected(state) {
    return state.elementList.find(item => item.selected);
  },
  gt_indexSelected(state) {
    return state.elementList.findIndex(item => item.selected);
  },
  gt_mediaName(state) {
    return state.mediaName;
  },
  gt_themeColors(state) {
    return state.themeColors;
  }
};

export default getters;
