<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
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
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      @update:query-items="handleAfterRefresh"
    >
      <MeQueryItem label="Tên người dùng" :min-width="200">
        <n-input
          v-model:value="queryItems.username"
          type="text"
          placeholder="Vui lòng nhập tên người dùng"
          clearable
          @keydown.enter="() => $table?.handleSearch"
        />
      </MeQueryItem>

      <MeQueryItem label="Giới tính" :min-width="100">
        <n-select v-model:value="queryItems.gender" clearable :options="genders" />
      </MeQueryItem>

      <MeQueryItem label="Tình trạng" :min-width="100">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: 'Bật', value: 1 },
            { label: 'Tắt', value: 0 },
          ]"
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
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const genders = [
  { label: '-', value: -1 },
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 2 },
]
const roles = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))

const columns = [
  {
    title: 'Hình đại diện',
    key: 'avatar',
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'small',
        src: avatar,
      }),
  },
  { title: 'Tài khoản', key: 'username', width: 150, ellipsis: { tooltip: true } },
  { title: 'Tên đầy đủ', key: 'full_name', width: 150, ellipsis: { tooltip: true } },
  {
    title: 'Vai trò',
    key: 'roles',
    width: 200,
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: 'success', size: 'small', title: item.name, style: index > 0 ? 'margin-left: 8px;' : '' },
            { default: () => item.id }
          )
        )
      }
      return 'No role'
    },
  },
  {
    title: 'Giới tính',
    key: 'gender',
    width: 100,
    render(row) {
          return h(
            NTag,
            { type: 'success', size: 'small', style: '' },
            { default: () => genders.find((item) => row.gender === item.value)?.label ?? '' }
          )
    }
  },
  { title: 'E-mail', key: 'email', width: 150, ellipsis: { tooltip: true } },
  {
    title: 'Ngày tạo',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    },
  },
  {
    title: 'Tình trạng',
    key: 'enable',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => 'Bật',
          unchecked: () => 'Tắt',
        }
      ),
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
