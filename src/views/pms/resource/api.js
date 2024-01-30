/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:28:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import axios from 'axios'
import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/apibo/permission/menu/tree'),
  getButtonAndApi: (parentId) => request.get(`/apibo/permission/button-and-api/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: (data) => request.post('/apibo/permission', data),
  savePermission: (id, data) => request.patch(`/apibo/permission/${id}`, data),
  deletePermission: (id) => request.delete(`/apibo/permission/${id}`),
}
