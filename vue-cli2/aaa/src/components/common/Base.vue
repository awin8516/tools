<script>
let URL = "";
let BASE_URL = ""; // 设置全局 URL
let DOMAIN = "";
let FILE_URL = "";
let USEROPEN = "";
let CERTIFICATE = "";
let MUSIC = "";
let SMSFILE_URL = "";
let TEMPFILE = '';
let MENUS =
  '[{"id":1,"title":"概览","icon":"view","index":"echarts","pid":0},{"id":2,"title":"自动回复","icon":"reply","index":"dashboard","pid":0,"subs":[{"title":"被关注自动回复","icon":"el-icon-s-custom","index":"followreply"},{"title":"消息自动回复","icon":"el-icon-s-custom","index":"autoreply"},{"title":"关键词自动回复","icon":"el-icon-s-custom","index":"keywordreply"}]},{"id":6,"title":"菜单控制","icon":"menu","index":"customenu","pid":0,"subs":[{"title":"自定义菜单","icon":"el-icon-s-custom","index":"menugroup"},{"title":"个性化菜单","icon":"el-icon-s-custom","index":"imenugroup"}]},{"id":9,"title":"推广二维码","icon":"qrcode","index":"qrcode","pid":0,"subs":[{"title":"生成二维码","icon":"el-icon-postcard","index":"qrcode"},{"title":"扫码记录","icon":"el-icon-s-custom","index":"qrcoderecord"}]},{"id":12,"title":"网页授权","icon":"auth","index":"oauth","pid":0},{"id":14,"title":"用户管理","icon":"userManage","index":"UserTag","pid":0,"subs":[{"title":"用户列表","icon":"el-icon-s-custom","index":"UserInfo"},{"title":"用户动态","icon":"el-icon-s-custom","index":"UserDynamics"},{"title":"自定义标签组管理","icon":null,"index":"tagroup"},{"title":"自定义标签管理","icon":"el-icon-eleme","index":"customtag"},{"title":"微信标签","icon":"el-icon-postcard","index":"UserTag"}]},{"id":18,"title":"素材管理","icon":"material","index":"newslist","pid":0,"subs":[{"title":"外部链接素材管理","icon":"el-icon-s-custom","index":"linknewslist"},{"title":"图文素材管理","icon":"el-icon-postcard","index":"newslist"},{"title":"图片素材管理","icon":"el-icon-s-custom","index":"images"},{"title":"视频素材管理","icon":null,"index":"videos"},{"title":"音频素材管理","icon":null,"index":"musics"},{"title":"优惠券管理","icon":null,"index":"coupon"}]},{"id":22,"title":"消息群发","icon":"msg","index":"ordinarytask","pid":0,"subs":[{"title":"消息群发","icon":"el-icon-s-custom","index":"advancedtask"},{"title":"群发任务列表","icon":"el-icon-s-custom","index":"tasklist"},{"title":"模板消息群发","icon":null,"index":"Tempmessage"},{"title":"模板消息群发列表","icon":null,"index":"TempRecord"},{"title":"短信群发","icon":null,"index":"SmsTemp"},{"title":"短信群发任务列表","icon":null,"index":"SmsRecord"},{"title":"短信签名列表","icon":null,"index":"SmsList"}]},{"id":47,"title":"设置","icon":"set","index":"System","pid":0,"subs":[{"title":"系统操作日志","icon":null,"index":"SystemLog"}]},{"id":12,"title":"流程图","icon":"set","index":"flowChart","pid":0}]';
// const BASE_URL = 'https://scrmtest.beats-digital.com/scrm/api/'

var url = window.location.host;

if (url == "scrmtest.beats-digital.com") {
  console.log("test环境");
  URL = "https://scrmtest.beats-digital.com/";
} else if (url == "scrmpre.beats-digital.com") {
  console.log("预发布环境");
  URL = "https://scrmpre.beats-digital.com/";
} else if (url == "scrm2.beats-digital.com") {
  console.log("生产环境");
  URL = "https://scrm2.beats-digital.com/";
} else {
  console.log("test环境");
  URL = "https://scrmtest.beats-digital.com/";
}

// switch (flag) {
//   case "test":
//     console.log("test环境");
//     URL = "https://scrmtest.beats-digital.com/";
//     break;
//   case "pre":
//     console.log("预发布环境");
//     URL = "https://scrmpre.beats-digital.com/";
//     break;
//   case "pro":
//     console.log("生产环境");
//     URL = "https://scrm2.beats-digital.com/";
//     break;
// }
BASE_URL = URL + "scrm/api/";
DOMAIN = URL + "scrm/";
FILE_URL =
  "https://scrmcdn.beats-digital.com/scrm/files/2020/01/10/shiliwenjian.csv";
USEROPEN = URL + "scrm/home.html#/UserPortrait?uid=";
CERTIFICATE = URL + "download/certificate.doc";
MUSIC = URL + "";
TEMPFILE= 'https://scrmcdn.beats-digital.com/'

export default {
  BASE_URL,
  DOMAIN,
  FILE_URL,
  URL,
  MENUS,
  USEROPEN,
  CERTIFICATE,
  MUSIC,
  TEMPFILE
};
</script>