<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:59
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div>
    <n-space vertical :size="12">
      <h3>Menu</h3>
      <div class="flex">
        <n-input v-model:value="pattern" placeholder="Tìm kiếm" clearable />
        <n-button class="ml-12" type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-14" />
          Tạo mới
        </n-button>
      </div>

      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        :data="treeData"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        :on-update:selected-keys="onSelect"
        key-field="code"
        label-field="name"
        block-line
        default-expand-all
      />
    </n-space>

    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="(data) => emit('refresh', data)" />
  </div>
</template>

<script setup>
import { withModifiers } from 'vue'
import ResAddOrEdit from './ResAddOrEdit.vue'
import { NButton } from 'naive-ui'
import api from '../api'

defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  currentMenu: {
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(['refresh', 'update:currentMenu'])

const pattern = ref('')

const modalRef = ref(null)
async function handleAdd(data = {}) {
  modalRef.value?.handleOpen({
    action: 'add',
    title: 'New menu item',
    row: { type: 'MENU', ...data },
    okText: 'Lưu',
  })
}

function onSelect(keys, option, { action, node }) {
  emit('update:currentMenu', action === 'select' ? node : null)
}

function renderPrefix({ option }) {
  return h('i', { class: `${option.icon}?mask text-16` })
}

function renderSuffix({ option }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: 'Thêm menu con',
        size: 'tiny',
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
      },
      { default: () => 'Mới' }
    ),

    h(
      NButton,
      {
        text: true,
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 12px;',
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => 'Xóa bỏ' }
    ),
  ]
}

function handleDelete(item) {
  $dialog.confirm({
    content: `Bạn muốn xóa【${item.name}】`,
    async confirm() {
      try {
        $message.loading('Xóa', { key: 'deleteMenu' })
        await api.deletePermission(item.id)
        $message.success('Xóa thành công', { key: 'deleteMenu' })
        emit('refresh')
      } catch (error) {
        $message.destroy('deleteMenu')
      }
    },
  })
}
</script>
