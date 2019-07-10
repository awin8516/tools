import { deepClone, array2Tree, object2style, formatHtml, clearStyle } from "@/utils";
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
    // console.log(state)
    const pageName = state.screenOptions.name;
    function createJson(state) {
      return JSON.stringify(state).replace(
        ',"el":{"_prevClass":"po-screen"}',
        ""
      );
    }

    function createHtml(screen) {
      let html = screen.el.innerHTML
        .replace(
          /<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g,
          ""
        )
        .replace(
          /data-name="((?:(?!data-name).)*?)"\ssrc="data:image\/(.*?);base64,.*?"/g,
          'src="image/' + pageName + '/$1-' + state.mediaName + '.$2"'
        )
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
      regexp = /src="\s*\S+"|background-image(:\s|:)url[("|('|(&quot;]\s*\S+[")|')|&quot;)]/g;
      const srcArr = screen.el.innerHTML.match(regexp);
      let imgs = [];
      srcArr &&
        srcArr.forEach((src, index) => {
          if (src.match(/data:image\/(.*?);base64/)) {
            imgs.push({
              fileExt: src
                .match(/data:image\/(.*?);base64/)[1]
                .replace("jpeg", "jpg"),
              name: nameArr[index].replace(/data-name=|"|'/g, "") + '-' + state.mediaName,
              src: src
                .replace(/src=|"|'|background-image(:\s|:)url(\("|\('|\(&quot;)|("\)|'\)|&quot;\))/g, "")
                .replace(/data:image\/(.*?);base64(,|;)/, "")
            });
          }
        });
      // console.log(imgs)
      return imgs;
    }

    function createCss(state) {
      let css = "/* " + pageName + ".css */\n";
      let _state = clearStyle(deepClone(state));
      const tree = array2Tree(deepClone(_state.elementList), "vid", "pid");
      const getClassName = className => "." + className.replace(/\s+/g, " ").split(" ").join(".");
      const getStyle = (element, key) => {
        if (element.style[key]) {
          let style = element.style[key];
          for (const k in style) {
            if (k === "background-image" && style["background-image"] && style["background-image"].match(/data:image\/(.*?);base64/)) {
              const src = style["background-image"];
              // console.log(src)
              style["background-image"] = style["background-image"].replace(/.*?data:image\/(.*?);.*/g, "url(../image/" + pageName + "/" + element.name + '-' + key + ".$1)").replace(/\.jpeg/g, ".jpg");
              if (key !== _state.mediaName) {
                file.imgs.push({
                  fileExt: src.match(/data:image\/(.*?);base64/)[1].replace("jpeg", "jpg"),
                  name: element.name + '-' + key,
                  src: src.replace(/url(\(|\("|\('|\(&quot;)|(\)|"\)|'\)|&quot;\))/g, "").replace(/data:image\/(.*?);base64(,|;)/, "")
                })
              }
              break;
            }
          }
          return object2style(style).replace(/([0-9]+)px/g, pixel => {
            return (parseInt(pixel) * 0.01).toFixed(2) + "rem";
          })
        }
      };
      const mp = (_tree, parentClassName, key) => {
        _tree.forEach(element => {
          if (element.className) {
            const className = getClassName(element.className);
            const style = getStyle(element, key);
            if (style) {
              css += (parentClassName ? parentClassName + " " : "") + className + "{" + style + "}\n";
            }
            element.children.length && mp(element.children, className);
          }
        });
      };
      mp(tree, "", _state.mediaName);

      for (const key in _state.screenOptions.sizeList) {
        const media = _state.screenOptions.sizeList[key].media
        if (key !== _state.mediaName) {
          css += "\n";
          css += "/* " + key + " */\n";
          css += media + "{\n";
          mp(tree, "", key);
          css += "}";
        }
      }
      // console.log(css)
      return css;
    }

    let zip = new JSZip();
    let file = {

    }

    //project.json
    file.json = createJson(state);

    //HTML
    file.html = createHtml(state.screenOptions);

    //IMAGES
    file.imgs = createImg(state.screenOptions);

    //CSS
    file.css = createCss(state);


    zip.file(pageName + ".json", file.json);
    zip.file(pageName + ".html", file.html);
    let folderImg = zip.folder("image");
    let imgsub = folderImg.folder(pageName);
    file.imgs.forEach(element => { imgsub.file(element.name + "." + element.fileExt, element.src, { base64: true }); });
    let folderCss = zip.folder("css");
    folderCss.file(pageName + ".css", file.css);
    folderCss.file("common.css", "html{font-size:100px;}*{font-size:0.12rem;}");

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, pageName + ".zip");
    });
  }
};
export default actions;
