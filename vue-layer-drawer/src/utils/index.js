export function object2style(style) {
  return JSON.stringify(style)
    .replace("{", "")
    .replace("}", "")
    .replace(/"/g, "")
    .replace(/,/g, ";");
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
  const value = selecter.replace(/\.|#/g, '')
  let res = ele
  while (res && res[key].indexOf(value) == -1) {
    res = res.parentElement
  };
  return res
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
  console.log(arr)
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
    if (
      Old[key] === undefined ||
      Old[key] === null ||
      typeof Old[key] == "string" ||
      typeof Old[key] == "boolean"
    ) {
      // 不冲突的，直接赋值
      Old[key] = New[key];
      continue;
    }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以（Old）为准为主，
    // console.log(key)
    if (isJSON(Old[key]) || isArray(Old[key])) {
      // arguments.callee 递归调用，并且与函数名解耦
      //arguments.callee(Old[key], New[key]);
      mergeJSON(Old[key], New[key]);
    }
  }
  return Old;
}

//清除不同 media 中样式重复项，保留差异项
export function clearStyle(state) {
  const merge = (base, target) => {
    for (var key in base) {
      if (typeof base[key] == "string") {
        if (target[key] === base[key]) {
          delete target[key];
          continue;
        }
      }
      if (isJSON(base[key]) || isArray(base[key])) {
        merge(base[key], target[key]);
      }
    }
  }
  for (let element of state.elementList) {
    for (let key in element.style) {
      if (key !== state.mediaName) {
        merge(element.style[state.mediaName], element.style[key])
      }
    }
  }
  return state
}
