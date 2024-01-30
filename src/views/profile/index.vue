<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:30:11
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <n-avatar round :size="100" :src="userStore.avatar" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>Tên tài khoản:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <n-button class="ml-32" type="primary" text @click="pwdModalRef.open()">
              <i class="i-fe:edit mr-4" />
              Đổi mật khẩu
            </n-button>
          </div>
          <div class="mt-16 flex items-center">
            <n-button type="primary" ghost @click="avatarModalRef.open()">Thay đổi Avatar</n-button>
            <span class="ml-12 opacity-60">
              Thay đổi ảnh đại diện chỉ hỗ trợ link online, không cung cấp chức năng upload ảnh, bạn có thể tự kết nối nếu cần!
            </span>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" title="Thông tin cá nhân">
      <template #header-extra>
        <n-button type="primary" text @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          Sửa đổi
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item label="Viết tắt">{{ userStore.nickName }}</n-descriptions-item>
        <n-descriptions-item label="Giới tính">
          {{ genders.find((item) => item.value === userStore.userInfo?.gender)?.label ?? 'Không rõ' }}
        </n-descriptions-item>
        <n-descriptions-item label="Địa chỉ">{{ userStore.userInfo?.address }}</n-descriptions-item>
        <n-descriptions-item label="Mobile">{{ userStore.userInfo?.mobile_number }}</n-descriptions-item>
        <n-descriptions-item label="E-mail">{{ userStore.userInfo?.email }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <MeModal ref="avatarModalRef" width="420px" title="Thay đổi hình đại diện" @ok="handleAvatarSave()">
      <n-input v-model:value="newAvatar" />
    </MeModal>

    <MeModal ref="pwdModalRef" title="Đổi mật khẩu" width="420px" @ok="handlePwdSave()">
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="Mật khẩu cũ" path="oldPassword" :rule="required">
          <n-input v-model:value="pwdForm.oldPassword" type="password" placeholder="Nhập mật khẩu hiện tại" />
        </n-form-item>
        <n-form-item label="Mật khẩu" path="newPassword" :rule="required">
          <n-input v-model:value="pwdForm.newPassword" type="password" placeholder="Mật khẩu mới" />
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal ref="profileModalRef" title="Sửa đổi thông tin" width="420px" @ok="handleProfileSave()">
      <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
        <n-form-item label="Tên viết tắt" path="nickName">
          <n-input v-model:value="profileForm.nickName" placeholder="Tên viết tắt" />
        </n-form-item>
        <n-form-item label="Giới tính" path="gender">
          <n-select
            v-model:value="profileForm.gender"
            :options="genders"
            placeholder="Chọn giới tính"
          />
        </n-form-item>
        <n-form-item label="Địa chỉ" path="address">
          <n-input v-model:value="profileForm.address" placeholder="Nhập địa chỉ" />
        </n-form-item>
        <n-form-item label="Địa chỉ" path="mobile_number">
          <n-input v-model:value="profileForm.mobile_number" placeholder="Nhập số điện thoại" />
        </n-form-item>
        <n-form-item label="E-mail" path="email">
          <n-input v-model:value="profileForm.email" placeholder="Nhập e-mail" />
        </n-form-item>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'
import api from './api'

const userStore = useUserStore()
const required = {
  required: true,
  message: 'Thông tin này phải có',
  trigger: ['blur', 'change'],
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  await api.changePassword(pwdForm.value)
  $message.success('Đặt lại mật khẩu hoàn tất')
  refreshUserInfo()
}

const newAvatar = ref(userStore.avatar)
const [avatarModalRef] = useModal()
async function handleAvatarSave() {
  if (!newAvatar.value) {
    $message.error('Nhập địa chỉ hình đại diện')
    return false
  }
  await api.updateProfile({ id: userStore.userId, avatar: newAvatar.value })
  $message.success('Avatar được thay đổi thành công')
  refreshUserInfo()
}

const genders = [
  { label: 'Không rõ', value: 0 },
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 2 },
]
const [profileModalRef] = useModal()
const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nickName: userStore.nickName,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email,
  mobile_number: userStore.userInfo?.mobile_number
})
async function handleProfileSave() {
  await profileValidation()
  await api.updateProfile(profileForm.value)
  $message.success('Dữ liệu được thay đổi thành công.')
  refreshUserInfo()
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
