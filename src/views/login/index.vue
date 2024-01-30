<!-- eslint-disable no-undef -->
<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:36
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div
      class="m-auto max-w-700 min-w-345 f-c-c rounded-8 bg-opacity-20 bg-cover p-12 card-shadow auto-bg"
    >
      <div class="hidden w-380 px-20 py-35 md:block">
        <img src="@/assets/images/login_banner.png" class="w-full" alt="login_banner" />
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img src="@/assets/images/logo.png" height="50" class="mr-12" />
          {{ title }}
        </h2>
        <n-input
          v-model:value="loginInfo.username"
          autofocus
          class="mt-32 h-40 items-center"
          placeholder="Tên người dùng"
          :maxlength="20"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password"
          class="mt-20 h-40 items-center"
          type="password"
          show-password-on="mousedown"
          placeholder="Mật khẩu"
          :maxlength="20"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </n-input>

        <div class="mt-20 flex items-center">
          <n-input
            v-model:value="loginInfo.captcha"
            class="h-40 items-center"
            palceholder="Mã CAPCHA"
            :maxlength="4"
            @keydown.enter="handleLogin()"
          >
            <template #prefix>
              <i class="i-fe:key mr-12 opacity-20" />
            </template>
          </n-input>
          <img
            v-if="captchaUrl"
            :src="captchaUrl"
            alt="Mã xác nhận"
            height="40"
            class="ml-12 w-80 cursor-pointer"
            @click="initCaptcha"
          />
        </div>

        <n-checkbox
          class="mt-20"
          :checked="isRemember"
          label="Lưu đăng nhập"
          :on-update:checked="(val) => (isRemember = val)"
        />

        <div class="mt-20 flex items-center">
          <n-button
            class="h-40 flex-1 rounded-5 text-16"
            type="primary"
            ghost
            @click="quickLogin()"
          >
            Đăng nhập nhanh
          </n-button>

          <n-button
            class="ml-32 h-40 flex-1 rounded-5 text-16"
            type="primary"
            :loading="loading"
            @click="handleLogin()"
          >
            Đăng nhập
          </n-button>
        </div>
      </div>
    </div>

    <TheFooter class="py-12" />
  </div>
</template>

<script setup>
import { throttle, lStorage } from '@/utils'
import { useStorage } from '@vueuse/core'
import api from './api'
import { useUserStore, useAuthStore } from '@/store'
import { initUserAndPermissions } from '@/router'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_TITLE

const isLogined = computed(() => {
  return authStore.accessToken && userStore.roles
})

const loginInfo = ref({
  username: '',
  password: '',
})
function initLoginInfo() {
  const localLoginInfo = lStorage.get('loginInfo')
  if (localLoginInfo) {
    loginInfo.value.username = localLoginInfo.username || ''
    loginInfo.value.password = localLoginInfo.password || ''
  }
}

const captchaUrl = ref('')
const initCaptcha = throttle(() => {
  captchaUrl.value = '/api/auth/captcha?' + Date.now()
}, 500)

if (isLogined.value) {
  router.push({ path: '/role-select', query: route.query })
} else {
  initLoginInfo()
  initCaptcha()
}

function quickLogin() {
  loginInfo.value.username = 'eadmin'
  loginInfo.value.password = 'Password1'
  handleLogin(true)
}

const isRemember = useStorage('isRemember', true)
const loading = ref(false)
async function handleLogin(isQuick) {
  const { username, password, captcha } = loginInfo.value
  if (!username || !password) return $message.warning('Vui lòng nhập tên tài khoản và mật khẩu')
  if (!isQuick && !captcha) return $message.warning('Nhập mã xác nhận')
  try {
    loading.value = true
    $message.loading('Đang đăng nhập, vui lòng đợi...', { key: 'login' })
    const { data } = await api.login({ userId:username, pwd: password.toString(), captcha, isQuick })
    if (isRemember.value) {
      lStorage.set('loginInfo', { username, password })
    } else {
      lStorage.remove('loginInfo')
    }
    onLoginSuccess(data)
  } catch (error) {
    // 10003 - Lỗi xác minh
    if (error?.code === 10003) {
      // Refresh mã xác minh
      initCaptcha()
    }
    $message.destroy('login')
    console.error(error)
  }
  loading.value = false
}

async function onLoginSuccess(data = {}) {
  authStore.setToken(data)
  $message.loading('Đăng nhập...', { key: 'login' })
  try {
    await initUserAndPermissions()
    $message.success('Đăng nhập thành công', { key: 'login' })
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      router.push({ path, query: route.query })
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    $message.destroy('login')
  }
}
</script>
