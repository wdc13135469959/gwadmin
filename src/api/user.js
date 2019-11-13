// import request from '@/utils/request'
import { service, service1 } from '@/utils/request'

export function login(data) {
  let formData = new FormData()
  formData.append('action', JSON.stringify(data.action))
  return service({
    url: '/APPInterface/KPI.ashx',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: formData
  })
}

export function getInfo(token) {
  return service({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  let formData = new FormData()
  formData.append('action', JSON.stringify(data.action))
  return service({
    url: '/APPInterface/KPI.ashx',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: formData
  })
}
