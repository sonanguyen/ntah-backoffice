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
      width="1000px"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Parent menu" path="parent_id">
          <n-tree-select
            v-model:value="modalForm.parent_id"
            :options="menuOptions"
            label-field="cat_name"
            key-field="id"
            placeholder="Danh mục cha"
            :on-load="handleChildrenLoad"
            clearable
          />
        </n-form-item-gi>

        <n-form-item-gi :span="12" path="cat_name" :rule="required">
          <template #label>
            <QuestionLabel label="Tên danh mục" content="Tiêu đề" />
          </template>
          <n-input v-model:value="modalForm.cat_name" />
        </n-form-item-gi>

        <n-form-item-gi :span="12" path="seo_title">
          <template #label>
            <QuestionLabel label="SEO title" content="SEO title - Sử dụng cho Search engine." />
          </template>
          <n-input v-model:value="modalForm.seo_title" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="seo_desc">
          <template #label>
            <QuestionLabel label="SEO description" content="SEO description - Sử dụng cho Search engine." />
          </template>
          <n-input v-model:value="modalForm.seo_desc" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="seo_url" :rule="required">
          <template #label>
            <QuestionLabel label="SEO Url" content="SEO Url" />
          </template>
          <n-input v-model:value="modalForm.seo_url" />
        </n-form-item-gi>

        <n-form-item-gi :span="12" path="agency_id">
          <template #label>
            <QuestionLabel label="Đại lý" content="Đại lý" />
          </template>
          <n-select
          v-model:value="modalForm.agency_id"
          clearable
          :options="agencies"
          value-field="id"
          label-field="full_name"
        />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="active">
          <template #label>
            <QuestionLabel
              label="Hoạt động"
            />
          </template>
          <n-select v-model:value="modalForm.active" :options="activeOptions" clearable filterable />
        </n-form-item-gi>

        <n-form-item-gi :span="12" path="sort_order">
          <template #label>
            <QuestionLabel
              label="Thứ tự"
            />
          </template>
          <n-input v-model:value="modalForm.sort_order" />
        </n-form-item-gi>
        <n-form-item-gi :span=24 path="info.desc">
          <n-space class="mb-40">
          <QuillEditor :options="QuillOptions" v-model:content="modalForm.info.desc" theme="snow" content-type="html" toolbar="full" />
        </n-space>
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import icons from 'isme:icons'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['refresh'])

const QuillOptions = {
        debug: 'error',
        readOnly: false,
        theme: 'snow',
        placeholder:'Nhập mô tả ở đây!'
      }

const menuOptions = computed(() => {
  return [{ cat_name: 'Tất cả danh mục', id: '', children: props.categories || [] }]
})

const agencies = ref([])
api.getAllAgencies().then(({ data = [] }) => (agencies.value = data))

const componentOptions = pagePathes.map((path) => ({ label: path, value: path }))
const activeOptions = [
  { label: 'Đang hoạt động', value: true },
  { label: 'Không hoạt động', value: false },
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

function handleChildrenLoad(node) {
  return new Promise((resolve) => {
            api.getChildrenCategory(node.id).then(res => {
              node.children = res?.data || [];
              emit('update:childrenLoaded', node)
              resolve()
            });
        });  
}

async function onSave() {
  await validation()
  okLoading.value = true
  try {
    if (!modalForm.value.parent_id) modalForm.value.parent_id = null
    if (modalAction.value === 'add') {
      await api.addCategory(modalForm.value)
    } else if (modalAction.value === 'edit') {
      await api.saveCategory(modalForm.value)
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
