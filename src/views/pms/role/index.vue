<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:38
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        Thêm mới
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="Mã role" :min-width="100">
        <n-input
          v-model:value="queryItems.code"
          type="text"
          placeholder="Mã role"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>

      <MeQueryItem label="Tên role" :min-width="100">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="Tên role"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>

      <MeQueryItem label="Trạng thái" :min-width="80">
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
      >
        <n-form-item
          label="Tên role"
          path="name"
          :rule="{
            required: true,
            message: 'Nhập tên role',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="Mã Role"
          path="code"
          :rule="{
            required: true,
            message: 'Nhập mã Role',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item label="Quyền" path="permissionids">
          <CascadeTree
            v-model:value="modalForm.permissionids"
            :tree-data="permissionTree"
            label-field="name"
            key-field="id"
            class="cus-scroll max-h-200 w-full"
          />
        </n-form-item>
        <n-form-item label="Phân quyền" path="enable">
          <n-switch v-model:value="modalForm.enable">
            <template #checked>Cho phép</template>
            <template #unchecked>Không cho phép</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import CascadeTree from './components/CascadeTree.vue'

defineOptions({ name: 'RoleMgt' })

const router = useRouter()

const $table = ref(null)

const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  { title: 'Mã Role', key: 'code' },
  { title: 'Tên Role', key: 'name' },
  {
    title: 'Trạng thái',
    key: 'enable',
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          disabled: row.code === 'SUPER_ADMIN' || row.code === 'OWN',
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
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () =>
              router.push({ path: `/pms/role/user/${row.id}`, query: { roleName: row.name } }),
          },
          {
            icon: () => h('i', { class: 'i-fe:user-plus text-10' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN' || row.code === 'OWN',
            onClick: () => handleEdit(row),
          },
          {
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN' || row.code === 'OWN',
            onClick: () => handleDelete(row.id),
          },
          {
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]

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

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: 'Roles',
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    initForm: { enable: true },
    refresh: () => $table.value?.handleSearch(),
  })

const permissionTree = ref([])
api.getAllPermissionTree().then(({ data = [] }) => (permissionTree.value = data))
</script>
