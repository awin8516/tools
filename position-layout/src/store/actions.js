import { deepClone, createDOM, downloadFile } from "@/utils";
// import 'jszip/lib/index.js'
const actions = {
  ac_setScreen: ({ commit }, value) => {
    commit("SET_SCREEN", value);
  },
  // ac_setScreenOptions: ({ commit }, value) => {
  //   commit("SET_SCREENOPTIONS", value);
  // },
  // ac_setElementList: ({ commit }, value) => {
  //   commit("SET_ELEMENTLIST", deepClone(value));
  // },
  ac_selectElement({ commit, state }, element) {
    state.elementList.map(v => (v.selected = false));
    state.elementList.find(v => v === element).selected = true;
    commit("SET_ELEMENTLIST", deepClone(state.elementList));
  },
  ac_selectElementIndex({ commit, state }, index) {
    state.elementList.map(v => (v.selected = false));
    state.elementList[index].selected = true;
    commit("SET_ELEMENTLIST", deepClone(state.elementList));
  },
  ac_cancelacSelectElement({ commit, state, getters }) {
    getters.gt_elementSelected && (getters.gt_elementSelected.selected = false);
    commit("SET_ELEMENTLIST", state.elementList);
  },
  ac_deleteElement({ commit, state }, element) {
    let index = state.elementList.findIndex(v => v === element);
    state.elementList.splice(index, 1);
    commit("SET_ELEMENTLIST", state.elementList);
    if (state.elementList.length > 0) {
      state.elementList[state.elementList.length - 1].selected = true;
      commit("SET_ELEMENTLIST", state.elementList);
    }
  },
  ac_deleteElementIndex({ commit, state }, index) {
    state.elementList.splice(index, 1);
    commit("SET_ELEMENTLIST", state.elementList);
    if (state.elementList.length > 0) {
      state.elementList[state.elementList.length - 1].selected = true;
      commit("SET_ELEMENTLIST", state.elementList);
    }
  },
  ac_updateLayer({ commit, state, getters }, act) {
    const index = getters.gt_indexSelected;
    if (index + act >= state.elementList.length - 1) {
      //置顶
      const _this = state.elementList[index];
      state.elementList.splice(index, 1);
      state.elementList = [...state.elementList, _this];
    } else if (index + act <= 0) {
      //置底
      const _this = state.elementList[index];
      state.elementList.splice(index, 1);
      state.elementList = [_this, ...state.elementList];
    } else {
      //上下移
      const _this = state.elementList[index];
      const _that = state.elementList[index + act];
      state.elementList[index] = _that;
      state.elementList[index + act] = _this;
    }
    commit("SET_ELEMENTLIST", state.elementList);
  },
  ac_downloadProject({ commit, state, getters }) {
    const JSZip = require("jszip");
    const name = state.screenOptions.style.name
    console.log(JSZip)
    // const DOM = createDOM(state.elementList)
    // state.screen.innerHTML
    const html = state.screen.innerHTML.replace(/<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g, '').replace(/src="(.*?)"/g, 'src="image/' + name + '/01.jpg"')
    const doc = '<!DOCTYPE html>\n\
                  <html lang="en">\n\
                  <head>\n\
                      <meta charset="UTF-8">\n\
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
                      <meta http-equiv="X-UA-Compatible" content="ie=edge">\n\
                      <title>Document</title>\n\
                  </head>\n\
                  <body><div class="container">'+ html + '</div></body>\n\
                  </html>';
    console.log(html)

    let zip = new JSZip();
    zip.file(name+".html", doc);
    let img = zip.folder("images");
    let css = zip.folder("css");

    img.file("smile.gif", imgData, { base64: true });
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        // see FileSaver.js
        saveAs(content, name+".zip");
      });



    // downloadFile(doc, 'aaa.html')
  }
};
export default actions;
