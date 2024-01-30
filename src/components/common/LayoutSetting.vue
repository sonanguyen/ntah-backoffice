<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:49:53
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div>
    <n-tooltip trigger="hover" placement="left">
      <template #trigger>
        <i class="i-fe:settings cursor-pointer text-32 color-primary" @click="modalRef.open()" />
      </template>
      Cài đặt giao diện
    </n-tooltip>

    <MeModal
      ref="modalRef"
      title="Cài đặt giao diện"
      :show-footer="false"
      width="600px"
      :modal-style="{ opacity: 0.85 }"
    >
      <n-space justify="space-between">
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('simple')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="60" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'simple' ? 'primary' : ''"
            ghost
          >
            Đơn giản - Simple
          </n-button>
        </div>
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('normal')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="10" />
              <n-skeleton class="mt-4" :width="80" :height="46" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'normal' ? 'primary' : ''"
            ghost
          >
            Thường dùng - Normal
          </n-button>
        </div>

        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('full')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="6" />
              <n-skeleton class="mt-4" :width="80" :height="4" />
              <n-skeleton class="mt-4" :width="80" :height="42" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'full' ? 'primary' : ''"
            ghost
          >
            Đầy đủ - Full
          </n-button>
        </div>
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('empty')">
          <div class="flex">
            <n-skeleton :width="104" :height="60" />
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'empty' ? 'primary' : ''"
            ghost
          >
            Trống - Empty
          </n-button>
        </div>
      </n-space>
      <n-space vertical>
        <n-grid :span="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Vị trí hiển thị lỗi" class="mt-12">
          <n-select v-model:value="msgValue" :options="options" @update:value="handleMsgValue"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Vị trí hiển thị thông báo" class="mt-12">
          <n-select v-model:value="notiValue" :options="options" @update:value="handleNotiValue"/>
        </n-form-item-gi>
      </n-grid>
      </n-space>
      <p class="mt-16 opacity-50">
        Lưu ý: Cài đặt này chỉ có tác dụng cho những trang chưa có bố cục (Layout) hoặc được đặt theo hệ thống, bố cục được đặt trong khi cài đặt Menu luôn có độ ưu tiên cao nhất.
      </p>
    </MeModal>
  </div>
</template>

<script setup>
import { MeModal } from '@/components'
import { useAppStore } from '@/store'
import { useModal } from '@/composables'

const appStore = useAppStore()
const [modalRef] = useModal()

const msgValue = ref(appStore.msgPlacement)
const notiValue = ref(appStore.notiPlacement)

const options = [
  { label: 'Top Center', value: 'top' },
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom Right', value: 'bottom-right' },
]

function handleMsgValue(value, option) {
  console.log(value, option)
  appStore.setMsgPlacement(value);
}

function handleNotiValue(value, option) {
  console.log(value, option)
  appStore.setNotiPlacement(value);
}

</script>
