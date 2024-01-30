<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:46:57
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <n-space size="large">
      <n-card title="Buttons">
        <n-space>
          <n-button>Default</n-button>
          <n-button type="tertiary">Tertiary</n-button>
          <n-button type="primary">Primary</n-button>
          <n-button type="info">Info</n-button>
          <n-button type="success">Success</n-button>
          <n-button type="warning">Warning</n-button>
          <n-button type="error">Error</n-button>
        </n-space>
      </n-card>

      <n-card title="Icon buttons">
        <n-space>
          <n-button type="info">
            <i class="i-material-symbols:add mr-4 text-18" />
            New
          </n-button>
          <n-button type="error">
            <i class="i-material-symbols:delete-outline mr-4 text-18" />
            Delete
          </n-button>
          <n-button type="warning">
            <i class="i-material-symbols:edit-outline mr-4 text-18" />
            Warning
          </n-button>
          <n-button type="primary">
            <i class="i-majesticons:eye-line mr-4 text-18" />
            Primary
          </n-button>
        </n-space>
      </n-card>
    </n-space>

    <n-space size="large" mt-30>
      <n-card min-w-340 title="Notifications">
        <n-space>
          <n-button @click="notify('info')">Info</n-button>
          <n-button @click="notify('success')">Success</n-button>
          <n-button @click="notify('warning')">Warning</n-button>
          <n-button @click="notify('error')">Error</n-button>
        </n-space>
      </n-card>

      <n-card min-w-340 title="Dialogs">
        <n-button type="error" @click="handleDelete">
          <i class="i-mi:delete mr-4" />
          Delete
        </n-button>
      </n-card>

      <n-card min-w-340 title="Messages">
        <n-space>
          <n-button :loading="loading" type="primary" @click="handleLogin">
            <i v-show="!loading" class="i-mdi:login mr-4" />
            Login
          </n-button>
          <n-button type="error" @click="handleMultiMessage">Multiple messages</n-button>
        </n-space>
      </n-card>
    </n-space>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'
const handleDelete = function () {
  $dialog.confirm({
    content: 'Are you sure you want to delete?',
    confirm() {
      $message.success('Already removed.')
    },
    cancel() {
      $message.warning('Cancelled')
    },
  })
}

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  $message.loading('Login...', { key: 'login' })
  await sleep(2000)
  $message.error('Failed to login', { key: 'login' })
  await sleep(500)
  $message.loading('Try login again...', { key: 'login' })
  await sleep(2000)
  $message.success('Loggged in', { key: 'login' })
  loading.value = false
}

function handleMultiMessage() {
  $message.error(['User name is required!', 'Password is required!', 'Password must have at least 6 characters!'])
}

function notify(type) {
  $notification[type]({
    content: 'What do I say?',
    meta: 'I do not known',
    duration: 2500,
    keepAliveOnHover: true,
  })
}
</script>
