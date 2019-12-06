const requireAll = r => {
  const a = {}
  r.keys().map(key => {
    a[key.match(/\.\/(.*?)\.(.*?)/)[1]] = r(key).default
  })
  return a
}
const req = require.context('./', false, /\.vue$/)
const tags = requireAll(req);
// console.log(tags)
module.exports = tags
