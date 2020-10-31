const getNowFormatDate = () => {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

const getAfterDate = (time) => {
  var date1 = new Date(),
    time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + time);
  var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  return time2;
}

const format = (time) => {
  var time = new Date(time);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y + "-" + add(m) +
    "-" + add(d) +
    " " + add(h) +
    ":" + add(mm) +
    ":" + add(s)
  );

  function add(m) {
    return m < 10 ? "0" + m : m;
  }
}


const getQueryString = (name) => {
  if (name && name != '') {
    var params = window.location.href.split('?')[1]
    params = params.split('=')[1]
    return window.atob(params);
  } //end if
  else return null;
}

// 12种类型
const handleDivision = (value) => {
  switch (parseInt(value)) {
    case 1:
      return '文本';
    case 2:
      return '外链图文';
    case 3:
      return '语音';
    case 4:
      return '图文';
    case 5:
      return '视频';
    case 6:
      return '图片';
    case 7:
      return '小程序';
    case 8:
      return '地理位置';
    case 9:
      return '其他';
    case 10:
      return '优惠券';
    case 11:
      return '会员卡';
    case 12:
      return '文本';
    default:
      return '小视频';
  }
}

const utils = {
  getNowFormatDate, getAfterDate, getQueryString, format,handleDivision
}

export default utils;