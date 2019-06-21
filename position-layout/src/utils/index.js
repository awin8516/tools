export function object2style(style) {
  return JSON.stringify(style)
    .replace('{', '')
    .replace('}', '')
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

export function downloadFile(content, filename) {
  // 创建a标签
  let linkNode = document.createElement('a');
  linkNode.download = filename;
  linkNode.style.display = 'none';
  // 利用Blob对象将字符内容转变成二进制数据
  let blob = new Blob([content]);
  linkNode.href = URL.createObjectURL(blob);
  // 点击
  document.body.appendChild(linkNode);
  linkNode.click();
  // 移除
  document.body.removeChild(linkNode);
}
