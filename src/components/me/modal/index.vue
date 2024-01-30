<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/01/13 17:41:38
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-modal
    v-model:show="show"
    class="modal-box"
    :style="{ width: modalOptions.width, ...modalOptions.modalStyle }"
    :preset="undefined"
    size="huge"
    :bordered="false"
    @after-leave="onAfterLeave"
  >
    <n-card :style="modalOptions.contentStyle" :closable="modalOptions.closable" @close="close()">
      <template #header>
        <header class="modal-header">{{ modalOptions.title }}</header>
      </template>
      <slot></slot>

      <template #footer>
        <slot v-if="$slots.footer" name="footer" />
        <footer v-else-if="modalOptions.showFooter" class="flex justify-end">
          <n-button v-if="modalOptions.showCancel" @click="handleCancel()">
            {{ modalOptions.cancelText }}
          </n-button>
          <n-button
            v-if="modalOptions.showOk"
            type="primary"
            :loading="modalOptions.okLoading"
            class="ml-20"
            @click="handleOk()"
          >
            {{ modalOptions.okText }}
          </n-button>
        </footer>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { initDrag } from './utils'
const props = defineProps({
  width: {
    type: String,
    default: '800px',
  },
  title: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: 'Hủy bỏ',
  },
  okText: {
    type: String,
    default: 'Đồng ý',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  modalStyle: {
    type: Object,
    default: () => {},
  },
  contentStyle: {
    type: Object,
    default: () => {},
  },
  onOk: {
    type: Function,
    default: () => {},
  },
  onCancel: {
    type: Function,
    default: () => {},
  },
})
const show = ref(false)
const modalOptions = ref({})

async function open(options = {}) {
  modalOptions.value = { ...props, ...options }

  show.value = true
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1),
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1)
  )
}

function close() {
  show.value = false
}

async function handleOk(data) {
  if (typeof modalOptions.value.onOk !== 'function') {
    return close()
  }
  try {
    const res = await modalOptions.value.onOk(data)
    res !== false && close()
  } catch (error) {
    okLoading.value = false
    console.error(error)
  }
}

async function handleCancel(data) {
  if (typeof modalOptions.value.onCancel !== 'function') {
    return close()
  }
  try {
    const res = await modalOptions.value.onCancel(data)

    res !== false && close()
  } catch (error) {
    okLoading.value = false
    console.error(error)
  }
}

async function onAfterLeave() {
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1),
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1)
  )
}

const okLoading = computed({
  get() {
    return !!modalOptions.value?.okLoading
  },
  set(v) {
    if (modalOptions.value) {
      modalOptions.value.okLoading = v
    }
  },
})

defineExpose({
  open,
  close,
  handleOk,
  handleCancel,
  okLoading,
  options: modalOptions,
})
</script>
