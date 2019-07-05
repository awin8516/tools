import { deepClone, array2Tree, object2style, formatHtml } from "@/utils";
import JSZip from "jszip";
import saveAs from "jszip/vendor/FileSaver";

const actions = {
  ac_updateMediaName: ({ commit }, value) => {
    commit("SET_UPDATEMEDIANAME", value);
  },
  ac_updateScreenAttr: ({ commit }, value) => {
    commit("SET_UPDATESCREENATTR", value);
  },
  ac_updateScreenStyle: ({ commit }, value) => {
    commit("SET_UPDATESCREENSTYLE", value);
  },
  ac_updateScreenElement: ({ commit }, value) => {
    commit("SET_UPDATESCREENELEMENT", value);
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
  ac_updateElementAttr: ({ commit }, element) => {
    commit("SET_UPDATEELEMENTATTR", element);
  },
  ac_updateStyle({ commit }, style) {
    commit("SET_UPDATESTYLE", style);
  },
  ac_updateLayer({ commit }, act) {
    commit("SET_UPDATELAYER", act);
  },
  ac_resetName({ state }, element) {
    const getLenByTagName = tagName => {
      return state.elementList.filter(v => v.tagName == tagName).length + 1;
    };
    let len = 0;
    switch (element.tagName) {
      case "div":
        len = getLenByTagName("div");
        element.name = "div-" + len;
        element.id = "div-" + len;
        element.className = "div div-" + getLenByTagName("div");
        break;
      case "img":
        len = getLenByTagName("img");
        element.name = "img-" + len;
        element.id = "img-" + len;
        element.className = "img img-" + len;
        break;
      default:
    }
  },
  ac_importProject({ commit }, json) {
    const _state = JSON.parse(json);
    commit("SET_STATE", _state);
  },
  //打包下载
  ac_exportProject({ state }) {
    const pageName = state.screenOptions.name;
    function createJson(state) {
      return JSON.stringify(state).replace(
        ',"el":{"_prevClass":"po-screen"}',
        ""
      );
    }

    function createHtml(screen) {
      let html = screen.el.innerHTML
        .replace(/<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g, "")
        .replace(/data-name="((?:(?!data-name).)*?)"\ssrc="data:image\/(.*?);base64,.*?"/g, 'src="image/' + pageName + '/$1.$2"')
        .replace(/\.jpeg/g, ".jpg");
      html = formatHtml(html);
      const doc =
        '<!DOCTYPE html>\n\
        <html lang="en">\n\
        <head>\n\
            <meta charset="UTF-8">\n\
            <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
            <meta http-equiv="X-UA-Compatible" content="ie=edge">\n\
            <title>' +
        pageName +
        '</title>\n\
            <link rel="stylesheet" type="text/css" href="css/common.css">\n\
            <link rel="stylesheet" type="text/css" href="css/' +
        pageName +
        '.css">\n\
        </head>\n\
        <body>\
        <div class="container">\n' +
        html +
        "</div>\n</body>\n\
        </html>";
      return doc;
    }

    function createImg(screen) {
      let regexp = /data-name="\s*\S+"/g;
      const nameArr = screen.el.innerHTML.match(regexp);
      regexp = /src="\s*\S+"|background-image(:\s|:)url[\("|\('|\(&quot;]\s*\S+["\)|'\)|&quot;\)]/g;
      const srcArr = screen.el.innerHTML.match(regexp);
      let imgs = [];
      srcArr &&
        srcArr.forEach((src, index) => {
          if (src.match(/data:image\/(.*?);base64/)) {
            imgs.push({
              fileExt: src.match(/data:image\/(.*?);base64/)[1].replace("jpeg", "jpg"),
              name: nameArr[index].replace(/data-name=|"|'/g, ""),
              src: src.replace(/src=|"|'|background-image(:\s|:)url(\("|\('|\(&quot;)|("\)|'\)|&quot;\))/g, "").replace(/data:image\/(.*?);base64(,|;)/, "")
            });
          }
        });
      return imgs;
    }

    function createCss(state) {
      let css = "/* " + pageName + ".css */\n";
      const tree = array2Tree(deepClone(state.elementList), "vid", "pid");
      const mp = (_tree, parentClassName) => {
        _tree.forEach(element => {
          if (element.className) {
            const className = '.' + element.className.replace(/\s+/g, " ").split(' ').join('.');
            let style = element.style[state.mediaName]
            for (let key in style) {
              if (style['background-image']) {
                style['background-image'] = style['background-image'].replace(/.*?data:image\/(.*?);.*/g, 'url(../image/' + pageName + '/' + element.name + '.$1)').replace(/\.jpeg/g, ".jpg");
              }
            }
            css +=
              (parentClassName ? parentClassName + " " : "") +
              className +
              "{" +
              object2style(style) +
              "}\n";
            element.children.length && mp(element.children, className);
          }
        });
      };
      mp(tree, "");
      return css.replace(/([0-9]+)px/g, function (pixel) {
        return (parseInt(pixel) * 0.01).toFixed(2) + "rem";
      });
    }

    let zip = new JSZip();

    //project.json
    const json = createJson(state);
    zip.file(pageName + ".json", json);

    //HTML
    const html = createHtml(state.screenOptions);
    zip.file(pageName + ".html", html);

    //IMAGES
    let folderImg = zip.folder("image");
    let imgsub = folderImg.folder(pageName);
    const imgs = createImg(state.screenOptions);
    imgs.forEach(element => {
      imgsub.file(element.name + "." + element.fileExt, element.src, {
        base64: true
      });
    });

    //CSS
    let folderCss = zip.folder("css");
    const css = createCss(state);
    folderCss.file(pageName + ".css", css);
    folderCss.file("common.css", "html{font-size:100px;}*{font-size:0.12rem;}");

    zip.generateAsync({ type: "blob" }).then(function(content) {
      saveAs(content, pageName + ".zip");
    });
  }
};
export default actions;
