function getCookie(name,defaultValue) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  console.log(reg,arr);
  if (arr = document.cookie.match(reg)){
    console.log(arr);
    return unescape(arr[2]);
  }
  else
    return defaultValue;
}

export {
  getCookie
}