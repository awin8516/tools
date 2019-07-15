const getters = {
  gt_screenOptions(state) {
    return state.project.screenOptions;
  },
  gt_elementList(state) {
    return state.project.elementList;
  },
  gt_elementSelected(state) {
    return state.project.elementList.find(item => item.selected);
  },
  gt_indexSelected(state) {
    return state.project.elementList.findIndex(item => item.selected);
  },
  gt_mediaName(state) {
    return state.project.mediaName;
  },
  gt_themeColors(state) {
    return state.project.themeColors;
  }
};

export default getters;
