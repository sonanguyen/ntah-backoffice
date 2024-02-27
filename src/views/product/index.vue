<!--------------------------------
 - @Author: Son Nguyen
 - @LastEditor: Son Nguyen
 - @LastEditTime: 2024/01/30 21:29:56
 - @Email: sonanguyen@gmail.com
 - Copyright © 2024 Anh Huy Software
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <n-button v-permission="'AddUser'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        Tạo mới
      </n-button>
    </template>

    <MeCrud
      ref="$productTable"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      @update:query-items="handleAfterRefresh"
    >
      <MeQueryItem label="Tên sản phẩm" :min-width="200">
        <n-input
          v-model:value="queryItems.product_name"
          type="text"
          placeholder="Nhập tên sản phẩm"
          clearable
          @keydown.enter="() => $table?.handleSearch"
        />
      </MeQueryItem>

      <MeQueryItem label="Hoạt động" :min-width="100">
        <n-select v-model:value="queryItems.active" clearable :options="productActivates" />
      </MeQueryItem>

      <MeQueryItem label="Đại lý" :min-width="250">
        <n-select
          v-model:value="queryItems.agency_id"
          clearable
          :options="agencies"
          label-field="brand_name"
          value-field="id"
        />
      </MeQueryItem>
      <MeQueryItem label="Danh mục" :min-width="250">
        <n-select
          v-model:value="queryItems.category_id"
          clearable
          :options="categories"
          label-field="cat_name"
          value-field="id"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="Tên người dùng"
          path="username"
          :rule="{
            required: true,
            message: 'Vui lòng nhập tên người dùng',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.username" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? 'Đặt lại mật khẩu' : 'Mật khẩu hiện tại'"
          path="password"
          :rule="{
            required: true,
            message: 'Vui lòng nhập mật khẩu',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="Roles" path="roles">
          <n-select
            v-model:value="modalForm.roles"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="Trạng thái" path="enable">
          <n-switch v-model:value="modalForm.enable">
            <template #checked>Bật</template>
            <template #unchecked>Tắt</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        Các thông tin khác người dùng tự bổ sung hoặc sửa đổi.
      </n-alert>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NP, NButton, NSwitch, NTag, NDataTable } from 'naive-ui'
import { formatDateTime,formatCurrency } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

import { h } from 'vue'

defineOptions({ name: 'ProductMgt' })

const $productTable = ref(null)
const queryItems = ref({})

onMounted(() => {
  $productTable.value?.handleSearch()
})

const productActivates = [
  { label: 'Tất cả', value: null },
  { label: 'Đang hoạt động', value: true },
  { label: 'Không hoạt động', value: false },
]

const agencies = ref([])
api.getAllAgencies().then(({ data = [] }) => (agencies.value = data))

const categories = ref([])
api.getAllCategories().then(({ data = [] }) => (categories.value = data))

const skusCols = [
  { title: 'SKU',
    key: 'sku_id',
    width: 80,
    ellipsis: { tooltip: true },    
  },
  { title: 'Tên SKU',
    key: 'sku',
    width: 80,
    ellipsis: { tooltip: true }
  },
  { title: 'Default?',
    key: 'isdefault',
    align: 'center',
    width: 60,
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => row.isdefault?"Yes":"No"}
          )
    }
},
{ title: 'Giá bán', 
  key: 'price', 
  width: 80,
  align: 'right',
  render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => formatCurrency(row.price)}
          )
    }
  },
  { title: 'Giá sale', 
    key: 'sale_price', 
    width: 80,
    align: 'right',
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => formatCurrency(row.sale_price)}
          )
    }
  },
  { title: 'Số lượng', 
    key: 'stock', 
    width: 80,
    align: 'center',
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => row.stock}
          )
    }
  },
  { title: 'ĐVT', 
    key: 'unit', 
    width: 60,
    align: 'center',
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => row.unit}
          )
    }
  },
]

const columns = [
  {
    title: 'Id',
    key: 'id',
    width: 80,
    ellipsis: { tooltip: true },
    type: 'expand',
    expandable: (rowData) => rowData.skus && rowData.skus.length,
    renderExpand: (rowData) => {
     return h(
        NDataTable,
        {size: 'small', columns: skusCols, data: rowData.skus, className: 'mx-40 my-2' }
      )
    }    
  },
  { title: 'Danh mục sản phẩm',
    key: 'category.cat_name',
    width: 150,
    ellipsis: { tooltip: true }
  },
  { title: 'Tên sản phẩm',
    key: 'product_name',
    width: 150,
    ellipsis: { tooltip: true },
    sorter: 'default' 
  },
  { title: 'Mô tả',
    key: 'info.desc',
    width: 150, 
    render(row) {
      return h(
        NP,
        { type: 'success' },
        { default: () => row.seo_title }
      )
    }
   },
  {
    title: 'Hoạt động',
    key: 'active',
    width: 100,
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => row.active === null?"-":row.active?'Active':'Inactive' }
          )
    }
  },
  {
    title: 'Ngày tạo',
    key: 'created_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['created_date']))
    },
  },
  {
    title: 'Ngày sửa',
    key: 'updated_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['updated_date']))
    },
  },
  {
    title: 'Hành động',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleOpenRolesSet(row),
          },
          {
            default: () => 'Roles',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: 'Đặt lại mật khẩu', row, onOk: onSave }),
          },
          {
            default: () => 'Mật khẩu',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => 'Xóa',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]


async function handleAfterRefresh() {
  try {
    $message.success('Refresh done!')
  } catch (error) {
    $message.error('Refresh error!')
  }
}

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('Thành công')
    $table.value?.handleSearch()
  } catch (error) {
    row.enableLoading = false
  }
}

function handleOpenRolesSet(row) {
  console.log("Row: ", row)
  const roles = row.roles.map((item) => item.id)
  handleOpen({
    action: 'setRole',
    title: 'Roles',
    row: { id: row.id, username: row.username, roles },
    onOk: onSave,
  })
}

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: 'Người dùng',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('Phân bổ thành công'),
    })
  } else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('Đặt lại mật khẩu thành công'),
    })
  }
  handleSave()
}
</script>
