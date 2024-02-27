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
      <h3>Danh mục sản phẩm</h3>
      <div class="flex">
        <n-input v-model:value="pattern" placeholder="Tìm kiếm" clearable />
        <n-button class="ml-12" type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-14"></i>
          Tạo mới
        </n-button>
      </div>

      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        :data="treeData"
        :render-switcher-icon="renderSwitcherIcon"
        :on-load="handleLoad"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        :on-update:selected-keys="onSelect"
        key-field="id"
        label-field="cat_name"
        block-line
      />
    </n-space>

    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="(data) => emit('refresh', data)" />
  </div>
</template>

<script setup>
import { ChevronRight,FolderDetails,ChevronUp } from '@vicons/carbon'
import { withModifiers } from 'vue'
import ResAddOrEdit from './ResAddOrEdit.vue'
import { NButton,NIcon } from 'naive-ui'
import api from '../api'

defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  currentCategory: {
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(['refresh', 'update:currentCategory','update:childrenLoaded'])

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

function renderSwitcherIcon( option, expanded, selected) {
  return h(NIcon, {size: 20}, { default: () => h(expanded ? ChevronUp : ChevronRight) })
}

function handleLoad(node) {
  return new Promise((resolve) => {
            api.getChildrenCategory(node.id).then(res => {
              node.children = res?.data || [];
              emit('update:childrenLoaded', node)
              resolve()
            });
        });  
}

function onSelect(keys, option, { action, node }) {
  emit('update:currentCategory', action === 'select' ? node : null)
}

function renderPrefix({ option }) {
  return h(NIcon, {size: 14}, { default: () => h(FolderDetails) })
}

function renderSuffix({ option }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: 'Thêm danh mục con',
        size: 'tiny',
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
      },
      { default: () => h('i',{class:'i-material-symbols:add mr-2 text-14'}) }
    ),

    h(
      NButton,
      {
        text: true,
        title: 'Xóa danh mục này',
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 6px;',
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => h('i',{class:'i-material-symbols:delete mr-4 text-14'}) }
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
