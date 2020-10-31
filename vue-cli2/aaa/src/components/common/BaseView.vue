
<script>
export default {
  methods: {
    mlk(value) {
    },
    showImg(url) {
      if (url) {
        return (
          "https://scrm.beats-digital.com/Ajax/Media/ShowImage?image=" + url
        );
      } else {
        return "";
      }
    },
    encodeUrl(obj) {
      let url = "";
      (function(obj) {
        let kvArr = Object.entries(obj);
        kvArr.forEach(v => {
          if (Object.prototype.toString.call(v[1]) == "[object Object]") {
            arguments.callee(v[1]);
          } else {
            url += v.join("=") + "&";
          }
        });
      })(obj);
      return url.substring(0, url.length - 1);
    },
    // 正则表达式判断url是否真确
    checkURL(URL) {
      var str = URL;
      // ^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$
      var Expression = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      var objExp = new RegExp(Expression);
      if (objExp.test(str) == true) {
        return true;
      } else {
        return false;
      }
    },
    // 12种类型
    handleDivision(value) {
      if(value == 'event'){
        return "事件"
      }
      if(value == 'authorize'){
        return "活动授权"
      }
      switch (parseInt(value)) {
        case 1:
          return "文本";
        case 2:
          return "外链图文";
        case 3:
          return "语音";
        case 4:
          return "图文";
        case 5:
          return "视频";
        case 6:
          return "图片";
        case 7:
          return "小程序";
        case 8:
          return "地理位置";
        case 9:
          return "其他";
        case 10:
          return "优惠券";
        case 11:
          return "会员卡";
        case 12:
          return "文本";
        default:
          return "其他";
      }
    },
    strToJson(str){
      return JSON.parse(str)
    }
  }
};
</script>