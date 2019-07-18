import { deepClone, array2Tree, object2style, formatHtml, clearSameStyle } from "@/utils";
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
  ac_deleteScreenStyle: ({ commit }, value) => {
    commit("SET_DELETESCREENSTYLE", value);
  },
  ac_updateScreenElement: ({ commit }, value) => {
    commit("SET_UPDATESCREENELEMENT", value);
  },
  ac_updateThemeColors: ({ commit }, value) => {
    commit("SET_UPDATETHEMECOLORS", value);
  },
  ac_selectElement({ commit }, element) {
    commit("SET_SELECTELEMENT", element);
  },
  ac_cancelacSelectElement({ commit, getters }) {
    commit("SET_CANCELACSELECTELEMENT", getters.gt_elementSelected);
  },
  ac_addElement({ commit }, element) {
    commit("SET_ADDELEMENT", element);
    commit("SET_SELECTELEMENT", element);
  },
  ac_deleteElement({ commit }, element) {
    commit("SET_DELETEELEMENT", element);
  },
  ac_updateElement: ({ commit }, element) => {
    commit("SET_UPDATEELEMENT", element);
  },
  ac_updateElementAttr: ({ commit }, attr) => {
    commit("SET_UPDATEELEMENTATTR", attr);
  },
  ac_deleteAttribute({ commit }, attr) {
    commit("SET_DELETEATTRIBUTE", attr);
  },
  ac_replaceElementAttr: ({ commit }, attr) => {
    commit("SET_REPLACEELEMENTATTR", attr);
  },
  ac_updateStyle({ commit }, style) {
    commit("SET_UPDATESTYLE", style);
  },
  ac_deleteStyle({ commit }, style) {
    commit("SET_DELETESTYLE", style);
  },
  ac_updateLayer({ commit }, act) {
    commit("SET_UPDATELAYER", act);
  },
  ac_updateElementOptions({ commit }, value) {
    commit("SET_UPDATEELEMENTOPTIONS", value);
  },
  ac_importProject({ commit }, json) {
    if (json) {
      const project = JSON.parse(json);
      commit("SET_PROJECT", project);
    } else {
      console.log("导入错误")
    }
  },
  ac_saveProject({ state }) {
    const project = JSON.stringify(state.project);
    window.localStorage.setItem('project', project)
  },
  ac_clearProject({ commit, state }) {
    const mediaName = state.project.mediaName
    commit("SET_CLEARPROJECT");
    commit("SET_UPDATEMEDIANAME", mediaName);
  },

  //打包下载
  ac_exportProject({ state }) {
    // console.log(state)
    const project = deepClone(state.project);
    const pageName = project.screenOptions.name;
    function createJson(project) {
      delete project.screenOptions.el
      return JSON.stringify(project)
    }

    function createHtml(project) {
      let html = state.default.screenOptions.el.innerHTML
        .replace(
          /<ins(.*?)>|<\/ins>|style="(.*?)"|<mark(.*?)<\/mark>|<!--(.*?)-->/g,
          ""
        )
        .replace(
          /data-name="((?:(?!data-name).)*?)"\ssrc="data:image\/(.*?);base64,.*?"/g,
          'src="image/' + pageName + '/$1-' + project.mediaName + '.$2"'
        )
        .replace(
          /data-name="((?:(?!data-name).)*?)"\ssrc="data:audio\/(.*?);base64,.*?"/g,
          'src="audio/$1.$2"'
        )
        .replace(
          /data-name="(.*?)"/g,
          ""
        ).replace(/\s+/g, ' ')
        .replace(/\.jpeg/g, ".jpg");
      let doc =
        '<!DOCTYPE html>\
        <html lang="en">\
        <head>\
          <meta charset="UTF-8">\
          <meta name="viewport" content="width=device-width, initial-scale=1.0">\
          <meta http-equiv="X-UA-Compatible" content="ie=edge">\
          <title>' + pageName + '</title>\
          <link rel="stylesheet" type="text/css" href="css/common.css">\
          <link rel="stylesheet" type="text/css" href="css/' + pageName + '.css">\
        </head>\
        <body>\
          <div class="container container-'+ pageName + '">' +
        html +
        '</div>\
        </body>\
        </html>';
      doc = doc.replace(/>(\s+|\r*|\n*)</g, '><')
      doc = formatHtml(doc);
      return doc;
    }

    function createFile(project, type) {
      const html = state.default.screenOptions.el.innerHTML
      let regexp = /data-name=".*?"/g;
      const nameArr = html.match(regexp);
      regexp = /src=["|']?(.*?)("|'|(?=\s)|(?=>))|background-image.*?\)/g;
      const srcArr = html.match(regexp);
      const extRegExp = new RegExp("data:" + type + "\/(.*?);base64");
      const subName = type === "image" ? '-' + project.mediaName : '';
      let files = [];
      srcArr &&
        srcArr.forEach((src, index) => {
          if (src.match(extRegExp)) {
            files.push({
              fileExt: src.match(extRegExp)[1].replace("jpeg", "jpg"),
              name: nameArr[index].replace(/data-name=|"|'/g, "") + subName,
              src: src.match(/base64,(.*?)(\s|'|"|\)|&quot;)/)[1]
            });
          }
        });
      return files;
    }

    function createPageCss(project) {
      let style = project.screenOptions.style
      for (const k in style) {
        if (k === "background-image" && style["background-image"] && style["background-image"].match(/data:image\/(.*?);base64/)) {
          const src = style["background-image"];
          // console.log(src)
          style["background-image"] = style["background-image"].replace(/.*?data:image\/(.*?);.*/g, "url(../image/" + pageName + "/page-bg.$1)").replace(/\.jpeg/g, ".jpg");
          file.imgs.push({
            fileExt: src.match(/data:image\/(.*?);base64/)[1].replace("jpeg", "jpg"),
            name: "page-bg",
            src: src.match(/base64,(.*?)(\s|'|"|\)|&quot;)/)[1]
          });
          break;
        }
      }
      return object2style(style).replace(/([0-9]+)px/g, pixel => {
        return (parseInt(pixel) * 0.01).toFixed(2) + "rem";
      });
    }

    function createCss(project) {
      project = clearSameStyle(project)
      let css = "/* " + pageName + ".css */\n";
      css += ".container-" + pageName + " {" + createPageCss(project) + "}\n\n";
      const tree = array2Tree(project.elementList, "vid", "pid");
      // console.log(tree);
      const getClassName = className => "." + className.replace(/\s+/g, " ").split(" ").join(".");
      const getStyle = (element, key) => {
        if (element.style[key]) {
          let style = element.style[key];
          for (const k in style) {
            if (k === "background-image" && style["background-image"] && style["background-image"].match(/data:image\/(.*?);base64/)) {
              const src = style["background-image"];
              // console.log(src)
              style["background-image"] = style["background-image"].replace(/.*?data:image\/(.*?);.*/g, "url(../image/" + pageName + "/" + element.name + '-' + key + ".$1)").replace(/\.jpeg/g, ".jpg");
              if (key !== project.mediaName) {
                file.imgs.push({
                  fileExt: src.match(/data:image\/(.*?);base64/)[1].replace("jpeg", "jpg"),
                  name: element.name + "-" + key,
                  src: src.match(/base64,(.*?)(\s|'|"|\)|&quot;)/)[1]
                });
              }
              break;
            }
          }
          return object2style(style).replace(/([0-9]+)px/g, pixel => {
            return (parseInt(pixel) * 0.01).toFixed(2) + "rem";
          });
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
            element.children.length && mp(element.children, className, key);
          }
        });
      };
      mp(tree, "", project.mediaName);

      for (const key in project.screenOptions.sizeList) {
        const media = project.screenOptions.sizeList[key].media;
        if (key !== project.mediaName) {
          css += "\n\n";
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
    let file = {};

    //HTML
    file.html = createHtml(project);

    //images
    file.imgs = createFile(project, "image");

    //audio
    file.audio = createFile(project, "audio");

    //CSS
    file.css = createCss(project);

    //project.json
    file.json = createJson(project);

    zip.file(pageName + ".json", file.json);
    zip.file(pageName + ".html", file.html);
    let folderImg = zip.folder("image");
    let imgsub = folderImg.folder(pageName);
    file.imgs.forEach(element => {
      imgsub.file(element.name + "." + element.fileExt, element.src, {
        base64: true
      });
    });
    let folderAudio = zip.folder("audio");
    file.audio.forEach(element => {
      folderAudio.file(element.name + "." + element.fileExt, element.src, {
        base64: true
      });
    });

    let folderCss = zip.folder("css");
    folderCss.file(pageName + ".css", file.css);
    folderCss.file("common.css", "html{font-size:100px;}*{font-size:0.12rem;}");

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, pageName + ".zip");
    });
  }
};
export default actions;
