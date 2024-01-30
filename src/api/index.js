/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:50:38
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  getUser: () => request.get('/apibo/user/detail'),
  refreshToken: () => request.get('/auth/refresh/token'),
  logout: () => request.post('/apibo/auth/logout'),
  switchCurrentRole: (role) => request.post(`/apibo/user/current-role/switch/${role}`),
  getRolePermissions: () => request.get('/apibo/role/permissions/tree'),
  validateMenuPath: (path) => request.get(`/apibo/permission/menu/validate?path=${path}`),
}
