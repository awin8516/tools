export function object2style(style) {
  return JSON.stringify(style)
    .replace('{', '')
    .replace('}', ';')
    .replace(/"/g, '')
    .replace(/,/g, ';');
}

export function style2object(style) {
  style = '{"' + style + '"}';
  style = style
    .replace(/\n/g, '')
    .replace(/:/g, '":"')
    .replace(/;;/g, ';')
    .replace(/;/g, '","')
    .replace(/,""}/g, '}');
  return JSON.parse(style);
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
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

export function createDOM(object) {
  // console.log(object)
}

//线型结构转成树形结构
export function array2Tree(array, key, parentKey) {
  array = array || []
  var tree = []
  var parentid = undefined
  var map = function(_tree, _parentid) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][parentKey] == _parentid) {
        array[i].children = []
        _tree.push(array[i])        
        map(array[i].children, array[i][key])
      }
    }
  }
  map(tree, parentid)
  return tree
}
