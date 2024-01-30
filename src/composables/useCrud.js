/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/12 09:03:00
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { useModal, useForm } from '.'

const ACTIONS = {
  view: 'Xem',
  edit: 'Sửa',
  add: 'Thêm',
}

export const useCrud = ({ name, initForm = {}, doCreate, doDelete, doUpdate, refresh }) => {
  const modalAction = ref('')
  const [modalRef, okLoading] = useModal()
  const [modalFormRef, modalForm, validation] = useForm(initForm)

  /** Add new */
  function handleAdd(row = {}, title) {
    handleOpen({ action: 'add', title, row: { ...initForm, ...row } })
  }

  /** Edit */
  function handleEdit(row, title) {
    handleOpen({ action: 'edit', title, row })
  }

  /** View */
  function handleView(row, title) {
    handleOpen({ action: 'view', title, row })
  }

  /** Open modal */
  function handleOpen(options = {}) {
    const { action, row, title, onOk } = options
    modalAction.value = action
    modalForm.value = { ...row }
    modalRef.value?.open({
      ...options,
      async onOk() {
        if (typeof onOk === 'function') {
          return await onOk()
        } else {
          return await handleSave()
        }
      },
      title: title ?? (ACTIONS[modalAction.value] || '') + name,
    })
  }

  /** Save */
  async function handleSave(action) {
    if (!action && !['edit', 'add'].includes(modalAction.value)) {
      return false
    }
    await validation()
    const actions = {
      add: {
        api: () => doCreate(modalForm.value),
        cb: () => $message.success('Thêm thành công.'),
      },
      edit: {
        api: () => doUpdate(modalForm.value),
        cb: () => $message.success('Cập nhật thành công.'),
      },
    }

    action = action || actions[modalAction.value]

    try {
      okLoading.value = true
      const data = await action.api()
      action.cb()
      okLoading.value = false
      data && refresh(data)
    } catch (error) {
      okLoading.value = false
      return false
    }
  }

  /** Delete */
  function handleDelete(id, confirmOptions) {
    if (!id && id !== 0) return
    const d = $dialog.warning({
      content: 'Bạn muốn xóa phải không?',
      title: 'Xác nhận',
      positiveText: 'Đồng ý',
      negativeText: 'Hủy bỏ',
      async onPositiveClick() {
        try {
          d.loading = true
          const data = await doDelete(id)
          $message.success('Đã xóa thành công!')
          d.loading = false
          refresh(data)
        } catch (error) {
          d.loading = false
        }
      },
      ...confirmOptions,
    })
  }

  return {
    modalRef,
    modalFormRef,
    modalAction,
    modalForm,
    okLoading,
    validation,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleOpen,
    handleSave,
  }
}
