import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const OperateOrganization = 'OperateOrganization'
const OperatorId = 'OperatorId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getToken1() {
  return Cookies.get(OperatorId)
}

export function setToken1(username) {
  return Cookies.set(OperatorId, username)
}

export function removeToken1() {
  return Cookies.remove(OperatorId)
}

export function getToken2() {
  return Cookies.get(OperateOrganization)
}

export function setToken2(password) {
  return Cookies.set(OperateOrganization, password)
}

export function removeToken2() {
  return Cookies.remove(OperateOrganization)
}

