const getters = {
  gt_elementList(state) {
    return state.elementList
  },
  gt_elementSelected(state) {
    return state.elementList.find(item => item.selected)
  },
  gt_indexSelected(state) {
    return state.elementList.findIndex(item => item.selected)
  }
}

export default getters
