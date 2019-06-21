import { deepClone } from '@/utils'
const actions = {
  ac_setScreenOptions: ({ commit }, value) => {
    commit('SET_SCREENOPTIONS', deepClone(value))
  },
  ac_setElementList: ({ commit }, value) => {
    commit('SET_ELEMENTLIST', deepClone(value))
  },
  ac_selectElement({ commit, state }, element) {
    console.log(9)
    state.elementList.map(v => (v.selected = false))
    state.elementList.find(v => (v === element)).selected = true
    commit('SET_ELEMENTLIST', deepClone(state.elementList))
  },
  ac_selectElementIndex({ commit, state }, index) {
    state.elementList.map(v => (v.selected = false))
    state.elementList[index].selected = true
    commit('SET_ELEMENTLIST', deepClone(state.elementList))
  },
  ac_cancelacSelectElement({ commit, state, getters }) {
    getters.gt_elementSelected && (getters.gt_elementSelected.selected = false)
    commit('SET_ELEMENTLIST', state.elementList)
  },
  ac_deleteElement({ commit, state }, index) {
    let _ElementList = deepClone(state.elementList)
    _ElementList.splice(index, 1)
    commit('SET_ELEMENTLIST', _ElementList)
    if (_ElementList.length > 0) {
      _ElementList[_ElementList.length - 1].selected = true
      commit('SET_ELEMENTLIST', _ElementList)
    }
  },
  ac_updateLayer({ commit, state, getters }, act) {
    const index = getters.gt_indexSelected
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
