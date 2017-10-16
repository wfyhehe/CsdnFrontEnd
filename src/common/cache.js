import CookieUtil from '@/common/cookie'

const TOKEN = '__token__'

const USER = '__user__'

const LOGIN_USER = '__loginUser__'

const LIKE_LIST = '__likeList__'

const TOKEN_SEPARATOR = '#'

export function setToken(token) {
  localStorage.setItem(TOKEN, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN)
}

export function TokenUtil() {
}

TokenUtil.parseUserId = (token) => {
  if (!token) {
    return ''
  }
  return token.split(TOKEN_SEPARATOR)[0]
}

TokenUtil.parseUuid = (token) => {
  if (!token) {
    return ''
  }
  return token.split(TOKEN_SEPARATOR)[1]
}

TokenUtil.stringifyToken = (token) => {
  if (token && token['userId'] && token['credentials']) {
    return token['userId'] + TOKEN_SEPARATOR + token['credentials']
  }
  return ''
}

export function deleteToken() {
  localStorage.removeItem(TOKEN)
}

export function getLoginUser() {
  return CookieUtil.getCookie(LOGIN_USER)
}

export function setLoginUser(username) {
  CookieUtil.setCookie(LOGIN_USER, username)
}

/*export function setUserInfo(userInfo) {
  localStorage.setItem(USER, JSON.stringify(userInfo))
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(USER))
}

export function deleteUserInfo() {
  localStorage.removeItem(USER)
}*/

export function initLikeList() {
  if (!localStorage.getItem(LIKE_LIST)) {
    localStorage.setItem(LIKE_LIST, JSON.stringify([]))
  }
}

export function getLikeList() {
  let ret = localStorage.getItem(LIKE_LIST)
  if (!ret) {
    localStorage.setItem(LIKE_LIST, JSON.stringify([]))
  }
  return JSON.parse(localStorage.getItem(LIKE_LIST))
}

export function addLikeList(item) {
  let list = JSON.parse(localStorage.getItem(LIKE_LIST))
  list.push(item)
  localStorage.setItem(LIKE_LIST, JSON.stringify(list))
}

export function deleteLikeList(item) {
  let list = JSON.parse(localStorage.getItem(LIKE_LIST))
  if (list.indexOf(item) >= 0) {
    list.splice(list.indexOf(item), 1)
  }
  localStorage.setItem(LIKE_LIST, JSON.stringify(list))
}

