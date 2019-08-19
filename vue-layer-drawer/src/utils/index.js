export function object2style(style) {
  return JSON.stringify(style)
    .replace('{"', '')
    .replace('"}', ';')
    .replace(/":"/g, ':')
    .replace(/","/g, ';');
}

export function style2object(style) {
  style = '{"' + style + '"}';
  style = style
    .replace(/\n/g, "")
    .replace(/:/g, '":"')
    .replace(/;;/g, ";")
    .replace(/;/g, '","')
    .replace(/,""}/g, "}");
  return JSON.parse(style);
}

export function closest(ele, selecter) {
  const key = selecter.indexOf('.') !== -1 ? 'className' : selecter.indexOf('#') !== -1 ? 'id' : 'tagName'
  let value = selecter.replace(/\.|#/g, '')
  if (key == 'tagName') {
    value = value.toLocaleUpperCase()
  }
  let res = ele
  while (res && res[key].indexOf(value) == -1) {
    res = res.parentElement
  };
  return res
}

export function getStyle(obj, attr) {
  if (!obj) return
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj, false)[attr];
  }
}

export function getTransform(style, attr) {
  let r
  if (style.transform) {
    let regExp = {
      translate: /translate\((.*?),\s*(.*?)\)/,
      rotate: /rotate\((.*?)deg\)/,
      scale: /scale\((.*?)\)/
    }
    r = style.transform.match(regExp[attr])
  } else {
    r = []
  }
  switch (attr) {
    case 'translate':
      return {
        x: r[1] || 0,
        y: r[2] || 0,
      }
    case 'rotate':
      return parseInt(r[1]) || 0
    case 'scale':
      return parseInt(r[1]) || 0
  }
}

export function getElementWidth(selecter) {
  const element = document.querySelector(selecter)
  return getStyle(element, 'width')
}
export function getElementHeight(selecter) {
  const element = document.querySelector(selecter)
  return getStyle(element, 'height')
}
export function getOutertWidth(style) {
  const width = style.width;
  const paddingLeft = style['padding-left'] || style['padding']
  for (const key in style) {

  }
}

export function styleSplit(key, value) {
  value = value.trim().replace(/\s+/g, ' ')
  switch (key) {
    case 'margin': case 'padding':
      if (!value.match(/\s/g)) {
        return {
          top: value,
          right: value,
          bottom: value,
          left: value
        }
      }
      if (value.match(/\s/g).length == 3) {
        const arr = value.split(' ')
        return {
          top: arr[0],
          right: arr[1],
          bottom: arr[2],
          left: arr[3]
        }
      } else if (value.match(/\s/g).length == 2) {
        const arr = value.split(' ')
        return {
          top: arr[0],
          right: arr[1],
          bottom: arr[2],
          left: arr[1]
        }
      } else if (value.match(/\s/g).length == 1) {
        const arr = value.split(' ')
        return {
          top: arr[0],
          right: arr[1],
          bottom: arr[0],
          left: arr[1]
        }
      }
  }

}

export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === "object") {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

export function file2base64(file) {
  const p = new Promise(function (resolve) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      resolve(e.target.result);
    };
  });
  return p;
}

export function resetLayerName(project, element) {
  const getLenBytype = type => {
    return project.elementList.filter(v => v.type == type).length + 1;
  };
  let len = 0;
  switch (element.type) {
    case "div":
      len = getLenBytype("div");
      element.name = "div-" + len;
      element.attribute.id = "div-" + len;
      element.attribute.className = "div div-" + getLenBytype("div");
      break;
    case "img":
      len = getLenBytype("img");
      element.name = "img-" + len;
      element.attribute.id = "img-" + len;
      element.attribute.className = "img img-" + len;
      break;
    case "txt":
      len = getLenBytype("txt");
      element.name = "txt-" + len;
      element.attribute.id = "txt-" + len;
      element.attribute.className = "txt txt-" + len;
      break;
    case "audio":
      len = getLenBytype("audio");
      element.name = "audio-" + len;
      element.attribute.id = "audio-" + len;
      element.attribute.className = "audio audio-" + len;
      break;
    case "input":
      len = getLenBytype("input");
      element.name = "input-" + len;
      element.attribute.id = "input-" + len;
      element.attribute.className = "input input-" + len;
      break;
    case "swiper":
      len = getLenBytype("swiper");
      element.name = "swiper-" + len;
      element.attribute.id = "swiper-" + len;
      element.attribute.className = "swiper-container swiper-" + len;
      break;
    default:
  }
  return element
}

export function formatHtml(html) {
  // let h = '<div class="div div-1" ><p>sdf</p><img src="image/index/img-1.jpg" class="img img-1" >测试文字<input type="text" /><img src="image/index/img-2.jpg" class="img img-2" ><img src="image/index/img-3.jpg" class="img img-3" ></div><div class="div div-2" ></div><div class="div div-3" ><img src="image/index/img-4.jpg" class="img img-4" ></div><div class="div div-4" ><img src="image/index/img-5.jpg" class="img img-5" ></div>测试文字<input type="text" >sdf<a class="div div-5" ></a>'
  // const arr = h.replace(/>/g, ">#|#").replace(/\/>/g, "/>#|#").replace(/<\//g, "#|#</").replace(/#\|##\|#/g, "#|#").split('#|#')
  const arr = html
    .replace(/(<)|(>)(?!<)|(<\/)|(\/>)(?!<)/g, function (str) {
      // console.log(str)
      let res = "";
      if (str == "<" || str == "</") {
        res = "#|#" + str;
      }
      if (str == ">" || str == "/>") {
        res = str + "#|#";
      }
      return res;
    })
    .split("#|#");
  // console.log(arr)
  const tabSize = 4;
  const tabStr = new Array(500).join(" ");
  const closureTags = [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "colgroup",
    "command",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "html",
    "i",
    "iframe",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "menu",
    "menuitem",
    "meter",
    "nav",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "tt",
    "u",
    "ul",
    "var",
    "video"
  ];
  let tabCounts = 0;
  let startTag = "";
  let end = false;
  function createTabSize(counts) {
    return tabStr.substr(0, counts * tabSize);
  }
  function getTag(str) {
    return (
      str.match(/^(<\/|<)(.*?)[\s|>]/) && str.match(/^(<\/|<)(.*?)[\s|>]/)[2]
    );
  }
  html = "";
  arr.forEach(v => {
    if (v.match(/^<\//)) {
      if (getTag(v) !== startTag) {
        tabCounts--;
      }
      end = true;
      v = createTabSize(tabCounts) + v;
      html += v + "\n";
    } else if (v.match(/^<(.*)[\s|>]/)) {
      startTag = getTag(v);
      if (end) {
        end = false;
      } else {
        tabCounts++;
      }
      v = createTabSize(tabCounts) + v;
      html += v + "\n";
      if (!closureTags.includes(startTag)) end = true;
    } else {
      startTag = getTag(v);
      if (end) {
        end = false;
      } else {
        tabCounts++;
      }
      v = createTabSize(tabCounts) + v;
      html += v + "\n";
      if (!closureTags.includes(startTag)) end = true;
    }
  });
  // console.log(html)
  return html;
}

//线型结构转成树形结构
export function array2Tree(array, key, parentKey) {
  array = array || [];
  var tree = [];
  var parentid = undefined;
  var map = function (_tree, _parentid) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][parentKey] == _parentid) {
        array[i].children = [];
        _tree.push(array[i]);
        map(array[i].children, array[i][key]);
      }
    }
  };
  map(tree, parentid);
  return tree;
}

export function isJSON(target) {
  return typeof target == "object" && target.constructor == Object;
}

export function isArray(o) {
  return Object.prototype.toString.call(o) == "[object Array]";
}

export function mergeJSON(Old, New) {
  for (var key in New) {
    // if (
    //   Old[key] === undefined ||
    //   Old[key] === null ||
    //   typeof Old[key] == "string" ||
    //   typeof Old[key] == "boolean"
    // ) {
    //   // 不冲突的，直接赋值
    //   Old[key] = New[key];
    //   continue;
    // }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以（Old）为准为主，
    if (isJSON(Old[key]) || isArray(Old[key])) {
      mergeJSON(Old[key], New[key]);
    } else {
      Old[key] = New[key];
    }
  }
  return Old;
}

//清除不同 media 中样式重复项，保留差异项
export function clearSameStyle(project) {
  const merge = (base, target) => {
    for (var key in base) {
      // if (
      //   base[key] === undefined ||
      //   base[key] === null ||
      //   typeof base[key] == "string" ||
      //   typeof base[key] == "boolean"
      // ) {
      //   if (target[key] === base[key]) {
      //     delete target[key];
      //   }
      //   continue;
      // }
      if (isJSON(base[key]) || isArray(base[key])) {
        merge(base[key], target[key]);
      } else {
        if (target[key] === base[key]) {
          delete target[key];
        }
      }
    }
  }
  for (let element of project.elementList) {
    for (let key in element.style) {
      if (key !== project.mediaName) {
        merge(element.style[project.mediaName], element.style[key])
      }
    }
  }
  return project
}

export function arraySort(array, propertyName, sort) {
  const s = (array, propertyName, sort) => {
    sort = sort || -1
    if (!array[0]) {
      return
    } else if (array[0][propertyName] === undefined || array[0][propertyName] === null) {
      return
    }
    // 属性值为非数字
    if (typeof array[0][propertyName] !== 'number') {
      return function (object1, object2) {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return sort < 0 ? value2.localeCompare(value1) : value1.localeCompare(value2)
      }
    } else {
      return function (object1, object2) {
        // 属性值为数字
        var value1 = parseFloat(object1[propertyName])
        var value2 = parseFloat(object2[propertyName])
        return sort < 0 ? value2 - value1 : value1 - value2
      }
    }
  }

  array.sort(s(array, propertyName, sort))
}

//注册右键菜单
export function registerContextMenu(element, menu) {
  if (menu.sort !== undefined) {
    element.$parent.contextMenuList.splice(menu.sort, 0, menu);
  } else {
    element.$parent.contextMenuList.push(menu);
  }
  return element.$parent.contextMenuList
}
