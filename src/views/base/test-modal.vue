<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/01/13 17:41:47
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <n-button type="primary" @click="openModal1">Open first dialog</n-button>
    <MeModal ref="$modal1">
      <n-input v-model:value="text" />
    </MeModal>
    <MeModal ref="$modal2" title="Nội dung được gửi từ hộp thoại trước đó">
      <h2>{{ text }}</h2>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'

const text = ref('')
const [$modal1, okLoading1] = useModal()
function openModal1() {
  $modal1.value?.open({
    title: 'First dialog',
    width: '600px',
    okText: 'Open second dialog',
    cancelText: 'Close',
    async onOk() {
      if (!text.value) {
        $message.warning('Vui lòng nhập cái gì đó!')
        return false // 阻止弹窗关闭
      }
      okLoading1.value = true
      $message.loading('Đang gửi thống báo...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('Đã gửi thành công', { key: 'modal1' })
      openModal2()
      return false // 默认关闭弹窗，返回false可让弹窗不关闭
    },
    onCancel(message) {
      $message.info(message ?? 'Cancel')
    },
  })
}

const [$modal2, okLoading2] = useModal()
function openModal2() {
  $modal2.value?.open({
    cancelText: 'Close',
    okText: 'Close all',
    width: '400px',
    async onOk() {
      okLoading2.value = true
      $message.loading('Closing...', { key: 'modal2' })
      await sleep(1000)
      okLoading2.value = false

      $modal1.value?.close()
      $message.success('Closed', { key: 'modal2' })
    },
  })
}
</script>
