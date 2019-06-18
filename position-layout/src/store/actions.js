import { deepClone } from '@/utils'
const actions = {
  setScreenOptions: ({ commit }, value) => {
    commit('SET_SCREENOPTIONS', value)
  },
  setElementList: ({ commit }, value) => {
    commit('SET_ELEMENTLIST', value)
  },
  selectElement({ commit, state }, index) {
    let _ElementList = deepClone(state.elementList)
    _ElementList.map(v => (v.selected = false))
    _ElementList[index].selected = true
    commit('SET_ELEMENTLIST', _ElementList)
  },
  cancelSelectElement({ commit, state, getters }) {
    if (getters.selectedIndex >= 0) {
      let _ElementList = deepClone(state.elementList)
      _ElementList[getters.selectedIndex].selected = false
      commit('SET_ELEMENTLIST', _ElementList)
    }
  },
  deleteElement({ commit, state }, index) {
    let _ElementList = deepClone(state.elementList)
    _ElementList.splice(index, 1)
    commit('SET_ELEMENTLIST', _ElementList)
    if (_ElementList.length > 0) {
      _ElementList[_ElementList.length - 1].selected = true
      commit('SET_ELEMENTLIST', _ElementList)
    }
  },
  updateLayer({ commit, state, getters }, act) {
    const index = getters.selectedIndex
    let _ElementList = deepClone(state.elementList)

    if (index + act >= _ElementList.length - 1) {
      //置顶
      const _this = _ElementList[index]
      _ElementList.splice(index, 1)
      _ElementList = [..._ElementList, _this]
    } else if (index + act <= 0) {
      //置底
      const _this = _ElementList[index]
      _ElementList.splice(index, 1)
      _ElementList = [_this, ..._ElementList]
    }else{
      //上下移
      const _this = _ElementList[index]
      const _that = _ElementList[index + act]
      _ElementList[index] = _that
      _ElementList[index + act] = _this
    }
    commit('SET_ELEMENTLIST', _ElementList)
  }
}
export default actions
