<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/12 09:03:43
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <MeModal ref="modalRef">
    <n-form
      ref="modalFormRef"
      label-placement="left"
      require-mark-placement="left"
      :label-width="100"
      :model="modalForm"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Parent menu" path="parentId">
          <n-tree-select
            v-model:value="modalForm.parentId"
            :options="menuOptions"
            label-field="name"
            key-field="id"
            placeholder="Parent menu"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="name" :rule="required">
          <template #label>
            <QuestionLabel label="Tên" content="Tiêu đề" />
          </template>
          <n-input v-model:value="modalForm.name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="code" :rule="required">
          <template #label>
            <QuestionLabel label="Mã số" content="Mã số tài nguyên" />
          </template>
          <n-input v-model:value="modalForm.code" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="path">
          <template #label>
            <QuestionLabel label="Route" content="Mục này có thể trống nếu có các mục con" />
          </template>
          <n-input v-model:value="modalForm.path" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="icon">
          <template #label>
            <QuestionLabel
              label="Biểu tượng"
              content="Need help?: https://icones.js.org/collection/all"
            />
          </template>
          <n-select v-model:value="modalForm.icon" :options="iconOptions" clearable filterable />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="layout">
          <template #label>
            <QuestionLabel
              label="layout"
              content="Nếu để trống sẽ sử dụng layout mặc định hệ thống"
            />
          </template>
          <n-select v-model:value="modalForm.layout" :options="layoutOptions" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="24" path="component">
          <template #label>
            <QuestionLabel
              label="View path"
              content="Đường dẫn tới View của tài nguyên này."
            />
          </template>
          <n-select
            v-model:value="modalForm.component"
            :options="componentOptions"
            clearable
            filterable
            tag
          />
        </n-form-item-gi>

        <n-form-item-gi :span="12" path="show">
          <template #label>
            <QuestionLabel label="Hiển thị" content="Có hiển thị trên thanh Menu hay không?" />
          </template>
          <n-switch v-model:value="modalForm.show">
            <template #checked>Hiển thị</template>
            <template #unchecked>Không hiển thị</template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="enable">
          <template #label>
            <QuestionLabel
              label="Trạng thái"
              content="Nếu là menu, lựa chọn này sẽ không được thêm vào bảng Route. Không thể truy cập trang nếu không cho phép"
            />
          </template>
          <n-switch v-model:value="modalForm.enable">
            <template #checked>Cho phép</template>
            <template #unchecked>Không cho phép</template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="enable">
          <template #label>
            <QuestionLabel
              label="KeepAlive"
              content="Để sử dụng KeepAlive, bạn phải đặt tên View theo mã của tài nguyên."
            />
          </template>
          <n-switch v-model:value="modalForm.keepAlive">
            <template #checked>Có</template>
            <template #unchecked>Không</template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="Thứ tự"
          path="order"
          :rule="{
            type: 'number',
            required: true,
            message: 'Giá trị này là số và bắt buộc phải có',
            trigger: ['blur', 'change'],
          }"
        >
          <n-input-number v-model:value="modalForm.order" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </MeModal>
</template>

<script setup>
import { MeModal } from '@/components'
import QuestionLabel from './QuestionLabel.vue'
import { useForm, useModal } from '@/composables'
import api from '../api'
import pagePathes from 'isme:page-pathes'
import icons from 'isme:icons'

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['refresh'])

const menuOptions = computed(() => {
  return [{ name: 'Root menu', id: '', children: props.menus || [] }]
})
const componentOptions = pagePathes.map((path) => ({ label: path, value: path }))
const iconOptions = icons.map((item) => ({
  label: () =>
    h('span', { class: 'flex items-center' }, [h('i', { class: item + ' text-18 mr-8' }), item]),
  value: item,
}))
const layoutOptions = [
  { label: 'Mặc định hệ thống', value: '' },
  { label: 'Đơn giản - Simple', value: 'simple' },
  { label: 'Thường dùng - Normal', value: 'normal' },
  { label: 'Đầy đủ - Full', value: 'full' },
  { label: 'Trống - Empty', value: 'empty' },
]
const required = {
  required: true,
  message: 'Giá trị bắt buộc',
  trigger: ['blur', 'change'],
}

const defaultForm = { enable: true, show: true }
const [modalFormRef, modalForm, validation] = useForm(defaultForm)
const [modalRef, okLoading] = useModal()

const modalAction = ref('')
function handleOpen(options = {}) {
  const { action, row = {}, ...rest } = options
  modalAction.value = action
  modalForm.value = { ...row }
  modalRef.value.open({ ...rest, onOk: onSave })
}

async function onSave() {
  await validation()
  okLoading.value = true
  try {
    if (!modalForm.value.parentId) modalForm.value.parentId = null
    if (modalAction.value === 'add') {
      await api.addPermission(modalForm.value)
    } else if (modalAction.value === 'edit') {
      await api.savePermission(modalForm.value.id, modalForm.value)
    }
    okLoading.value = false
    $message.success('Cập nhật thành công!')
    emit('refresh', modalForm.value)
  } catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}

defineExpose({
  handleOpen,
})
</script>
