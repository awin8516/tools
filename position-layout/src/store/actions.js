import { deepClone, array2Tree, object2style } from "@/utils";
import JSZip from "jszip";
import saveAs from "jszip/vendor/FileSaver";

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
  ac_addStyle({ commit, state, getters }, style) {
    getters.gt_elementSelected.style = Object.assign( {}, getters.gt_elementSelected.style, style);
    commit("SET_ELEMENTLIST", state.elementList);
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
  ac_resetName({ state }, element) {
    const getLenByTagName = (tagName) => {
      return state.elementList.filter(v => v.tagName == tagName).length + 1
    }
    let len = 0
    switch (element.tagName) {
      case 'div':
        len = getLenByTagName('div')
        element.className = ['div', 'div-' + getLenByTagName('div')]
        break
      case 'img':
        len = getLenByTagName('img')
        element.className = ['img', 'img-' + len]
        element.style.name = 'img-' + len
        break
      default:
    }
  },
  //打包下载
  ac_downloadProject({ state }) {
    const name = state.screenOptions.style.name;
    function createHtml(screen) {
      const html = screen.el.innerHTML
        .replace(
          /<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g,
          ""
        )
        .replace(
          /data-img-name="(.*?)" src="data:image\/(.*?);base64,(.*?)"/g,
          'src="image/' + screen.style.name + '/$1.$2"'
        )
        .replace(/\.jpeg/g, ".jpg");
      const doc =
        '<!DOCTYPE html>\n\
                    <html lang="en">\n\
                    <head>\n\
                        <meta charset="UTF-8">\n\
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">\n\
                        <title>'+ name + '</title>\n\
                        <link rel="stylesheet" type="text/css" href="css/'+ name + '.css">\n\
                    </head>\n\
                    <body><div class="container">' +
        html +
        "</div></body>\n\
                    </html>";
      return doc;
    }

    function createImg(screen) {
      let regexp = /data-img-name="\s*\S+"/g;
      const name = screen.el.innerHTML.match(regexp);
      regexp = /src="\s*\S+"/g;
      const src = screen.el.innerHTML.match(regexp);
      let imgs = [];
      name && name.forEach((element, index) => {
        imgs.push({
          fileExt: src[index].match(/data:image\/(.*?);base64,/)[1].replace("jpeg", "jpg"),
          name: element.replace(/data-img-name=|"|'/g, ""),
          src: src[index].replace(/src=|"|'/g, "").replace(/data:image\/(.*?);base64,/, "")
        });
      });
      return imgs;
    }

    function createCss(state) {
      let css = '\/* ' + name + '.css *\/\n'
      const tree = array2Tree(deepClone(state.elementList), 'vid', 'pid')
      const mp = (_tree, parentClassName) => {
        _tree.forEach(element => {
          const className = element.className.map(v => '.' + v).join('')
          const style = object2style(element.style)
          css += (parentClassName ? parentClassName + ' ' : '') + className + '{' + style + '}\n'
          element.children.length && mp(element.children, className)
        })
      }
      mp(tree, '')
      return css
    }

    let zip = new JSZip();

    //HTML
    const html = createHtml(state.screenOptions);
    zip.file(name + ".html", html);

    //IMAGES
    let folderImg = zip.folder("image");
    let imgsub = folderImg.folder(name);
    const imgs = createImg(state.screenOptions);
    imgs.forEach(element => {
      imgsub.file(element.name + '.' + element.fileExt, element.src, { base64: true });
    });

    //CSS
    let folderCss = zip.folder("css");
    const css = createCss(state);
    folderCss.file(name + ".css", css);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name + ".zip");
    });
  }
};
export default actions;
