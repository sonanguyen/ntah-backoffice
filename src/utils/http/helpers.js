/**********************************
 * @FilePath: helpers.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:22
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { useAuthStore } from '@/store'

let isConfirming = false
export function resolveResError(code, message) {
  switch (code) {
    case 401:
      if (isConfirming) return
      isConfirming = true
      $dialog.confirm({
        title: 'Xác nhận',
        type: 'info',
        content: 'Đăng nhập đã hết hạn. Bạn có muốn đăng nhập lại không?',
        confirm() {
          useAuthStore().logout()
          window.$message?.success('Đã đăng xuất.')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 11007:
    case 11008:
      if (isConfirming) return
      isConfirming = true
      $dialog.confirm({
        title: 'Xác nhận',
        type: 'info',
        content: `${message}，Bạn có muốn đăng nhập lại không?`,
        confirm() {
          useAuthStore().logout()
          window.$message?.success('Đã đăng xuất.')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 403:
      message = 'Yêu cầu bị từ chối.'
      break
    case 404:
      message = 'Thông tin không tồn tại.'
      break
    case 500:
      message = 'Lỗi phía máy chủ.'
      break
    default:
      message = message ?? `【${code}】: Lỗi không xác định!`
      break
  }
  return message
}
