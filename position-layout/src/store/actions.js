import { deepClone, array2Tree, object2style, formatHtml } from "@/utils";
import JSZip from "jszip";
import saveAs from "jszip/vendor/FileSaver";

const actions = {
  ac_setScreenStyle: ({ commit }, value) => {
    commit("SET_SCREENSTYLE", value);
  },
  ac_setScreenElement: ({ commit }, value) => {
    commit("SET_SCREENELEMENT", value);
  },
  ac_setSelectElement: ({ commit }, element) => {
    commit("SET_SETSELECTELEMENT", element);
  },
  ac_selectElement({ commit }, element) {
    commit("SET_SELECTELEMENT", element);
  },
  ac_cancelacSelectElement({ commit, getters }) {
    commit("SET_CANCELACSELECTELEMENT", getters.gt_elementSelected);
  },
  ac_addElement({ commit }, element) {
    commit("SET_ADDELEMENT", element);
  },
  ac_deleteElement({ commit }, element) {
    commit("SET_DELETEELEMENT", element);
  },
  ac_addStyle({ commit }, style) {
    commit("SET_ADDSTYLE", style);
  },
  ac_updateLayer({ commit, state, getters }, act) {

    commit("SET_UPDATELAYER", act);
  },
  ac_resetName({ state }, element) {
    const getLenByTagName = (tagName) => {
      return state.elementList.filter(v => v.tagName == tagName).length + 1
    }
    let len = 0
    switch (element.tagName) {
      case 'div':
        len = getLenByTagName('div')
        element.name = 'div-' + len
        element.id = 'div-' + len
        element.className = 'div div-' + getLenByTagName('div')
        break
      case 'img':
        len = getLenByTagName('img')
        element.name = 'img-' + len
        element.id = 'img-' + len
        element.className = 'img img-' + len
        break
      default:
    }
  },
  ac_importProject({ commit }, json) {
    const _state = JSON.parse(json)
    commit("SET_STATE", _state);
  },
  //打包下载
  ac_exportProject({ state }) {
    const name = state.screenOptions.style.name;
    function createJson(state) {
      return JSON.stringify(state).replace(',"el":{"_prevClass":"po-screen"}', '')
    }

    function createHtml(screen) {
      let html = screen.el.innerHTML
        .replace(
          /<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g,
          ""
        )
        .replace(
          /data-img-name="(.*?)" src="data:image\/(.*?);base64,(.*?)"/g,
          'src="image/' + screen.style.name + '/$1.$2"'
        )
        .replace(/\.jpeg/g, ".jpg");
      html = formatHtml(html)
      const doc =
        '<!DOCTYPE html>\n\
        <html lang="en">\n\
        <head>\n\
            <meta charset="UTF-8">\n\
            <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
            <meta http-equiv="X-UA-Compatible" content="ie=edge">\n\
            <title>'+ name + '</title>\n\
            <link rel="stylesheet" type="text/css" href="css/common.css">\n\
            <link rel="stylesheet" type="text/css" href="css/'+ name + '.css">\n\
        </head>\n\
        <body>\
        <div class="container">\n' +
        html +
        '</div>\n</body>\n\
        </html>';
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
          if (element.className) {
            const className = '.' + element.className.replace(/\s+/g, ' ').replace(/\s+/g, '.')
            // const className = element.className.map(v => '.' + v).join('')
            const style = object2style(element.style)
            css += (parentClassName ? parentClassName + ' ' : '') + className + '{' + style + '}\n'
            element.children.length && mp(element.children, className)
          }
        })
      }
      mp(tree, '')
      return css.replace(/([0-9]+)px/g, function (pixel) {
        return (parseInt(pixel) * 0.01).toFixed(2) + 'rem'
      })
    }

    let zip = new JSZip();

    //project.json
    const json = createJson(state);
    zip.file(name + ".json", json);

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
    folderCss.file("common.css", "html{font-size:100px;}*{font-size:0.12rem;}");

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name + ".zip");
    });
  }
};
export default actions;
