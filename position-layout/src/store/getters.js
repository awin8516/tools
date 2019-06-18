const getters = {
  list(state) {
    return state.elementList
  },
  elementSelected(state) {
    return state.elementList.find(item => item.selected)
  },
  selectedIndex(state) {
    return state.elementList.findIndex(item => item.selected)
  }
}

export default getters
