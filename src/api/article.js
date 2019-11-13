import { service, service1} from '@/utils/request'

export function fetchList(data) {
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

export function createData(data) {
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

export function treelist(data) {
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

export function mechanism(data) {
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
export function fetchArticle(id) {
  return service({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return service({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
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

export function updateArticle(data) {
  return service({
    url: '/article/update',
    method: 'post',
    data
  })
}
