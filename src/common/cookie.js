export default function CookieUtil() {
}

CookieUtil.setCookie = (name, value) => {
  let Days = 30
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toUTCString() + ";path=/"
}

CookieUtil.getCookie = (name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg))
    return decodeURI(arr[2])
  else
    return null
}

CookieUtil.deleteCookie = (name) => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1);
  let cval = CookieUtil.getCookie(name)
  if (cval !== null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString() + ";path=/"
}
