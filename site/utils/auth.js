// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return 'Admin-Token'
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return token
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return TokenKey
}
