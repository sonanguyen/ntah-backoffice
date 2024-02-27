/**--------------------------------
 - @Author: Son Nguyen
 - @LastEditor: Son Nguyen
 - @LastEditTime: 2024/1/31 21:28:53
 - @Email: sonanguyene@gmail.com
 - Copyright © 2024 Anh Huy Software
 --------------------------------- */
import { request } from '@/utils'

export default {
  addCategory: (data) => request.post('/apibo/category.service.create', data),
  read: (params = {}) => request.get('/apibo/product.service.pagingRead', { params }),
  saveCategory: (data) => request.patch(`/apibo/category.service.categoryPatch`, data),
  delete: (id) => request.delete(`/apibo/product/${id}`),
  activate: (id, data) => request.patch(`/apibo/product/activate/${id}`, data),
  getAllAgencies: () => request.get('/apibo/agency.service.readData?enable=1'),
  getAllCategories: () => request.get('/apibo/category.service.categoryRoots'),
  getChildrenCategory:(parent_id) => request.get(`/apibo/category.service.categoryChildren?parent_id=${parent_id}`),
}
