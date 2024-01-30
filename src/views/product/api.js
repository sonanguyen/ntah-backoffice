/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/apibo/product', data),
  read: (params = {}) => request.get('/apibo/product.service.pagingRead', { params }),
  update: (data) => request.patch(`/apibo/product/${data.id}`, data),
  delete: (id) => request.delete(`/apibo/product/${id}`),
  activate: (id, data) => request.patch(`/apibo/product/activate/${id}`, data),
  getAllAgencies: () => request.get('/apibo/agency.service.readData?enable=1'),
  getAllCategories: () => request.get('/apibo/category.service.readData'),
}
