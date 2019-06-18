export function object2style(style) {
  return JSON.stringify(style)
    .replace('{', '')
    .replace('}', '')
    .replace(/"/g, '')
    .replace(/,/g, ';')
}

export function style2object(style) {
  style = '{"'+style+'"}'
  style = style.replace(/\n/g, '').replace(/:/g, '":"').replace(/;;/g, ';').replace(/;/g, '","').replace(/,""}/g, '}')
  console.log(style)
  return JSON.parse(style)
  //   .replace('{', '')
  //   .replace('}', '')
  //   .replace(/"/g, '')
  //   .replace(/,/g, ';')
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}