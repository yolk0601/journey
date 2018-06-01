// 判断手机操作系统是 ios
function isIos() {
  var userAgent = navigator.userAgent.toLowerCase();
  return  (userAgent.indexOf('ipad') > -1 || userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipod') > -1)
}
// 判断手机操作系统是 android
function isAndroid () {
  var userAgent = navigator.userAgent.toLowerCase();
  return (userAgent.indexOf('android') > -1)
}
// 是否是电脑客户端
function isPC () {
    var userAgent = navigator.userAgent.toLowerCase();
    // 排除法
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgent.indexOf(Agents[v].toLowerCase()) > -1) {
            flag = false;
            break;
        }
    }
    return flag;
}
// 学而思app
function isMobile() {
  var userAgent = navigator.userAgent.toLowerCase();
  return  (userAgent.indexOf('jzh') > -1)
}
// 学生端直播PC客户端
function isPCclient () {
  var userAgent = navigator.userAgent.toLowerCase();
  return (userAgent.indexOf('xescef') > -1)
}