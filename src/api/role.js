import { service, service1 } from '@/utils/request'

export function getRoutes() {
  return service({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return service({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return service({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return service({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return service({
    url: `/role/${id}`,
    method: 'delete'
  })
}
