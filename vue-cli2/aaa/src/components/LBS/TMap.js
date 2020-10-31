export function TMap(key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)//注意这里
    }
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i] && scripts[i].src == 'https://3gimg.qq.com/lightmap/api_v2/2/4/122/main.js') {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
    }
    if (document.getElementById("qq")) {
      document.getElementById("qq").parentNode.removeChild(document.getElementById("qq"));
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://map.qq.com/api/js?v=2.exp&callback=init&key=" + key;
    script.id = 'qq';
    script.onerror = reject;
    document.head.appendChild(script);
  })
}