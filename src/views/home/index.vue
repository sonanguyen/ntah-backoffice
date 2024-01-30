<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:22
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <div class="flex">
      <n-card class="min-w-200 w-30%">
        <div class="flex items-center">
          <n-avatar round :size="60" :src="userStore.avatar" class="flex-shrink-0" />
          <div class="ml-20 flex-col">
            <span class="text-20 opacity-80">
              Hello, {{ userStore.nickName ?? userStore.username }}
            </span>
            <span class="mt-4 opacity-50">Role：{{ userStore.currentRole?.name }}</span>
          </div>
        </div>

        <p class="mt-28 text-14 opacity-60">Một người có thể thành công trong hầu hết mọi việc mà anh ta có lòng nhiệt tình vô hạn.</p>
        <p class="mt-12 text-right text-12 opacity-40">--Charles Scober</p>
      </n-card>
      <n-card class="ml-12 w-70%" title="✨ Welcome to Oliver Admin 0.1">
        <template #header-extra>
          <a
            class="text-14 text-primary text-highlight hover:underline hover:opacity-80"
            href="https://isme.top"
            target="_blank"
            @click.prevent="message?.info('Trang đang được phát triển...')"
          >
            www.ntah.com.vn
          </a>
        </template>

        <p class="opacity-60">
          Đây là mẫu quản lý back-end tối giản bao gồm các giải pháp front-end và back-end, front-end sử dụng Vite + Vue3 + Pinia +
           Unocss, phần phụ trợ sử dụng Nestjs + TypeOrm + Postgres dễ sử dụng và đẹp mắt!
        </p>
        <footer class="mt-12 flex items-center justify-end">
          <n-button
            type="primary"
            ghost
            tag="a"
            href="https://docs.isme.top/web/#/624306705/188522224"
            target="__blank"
          >
          Tài liệu phát triển
          </n-button>
          <n-button
            type="primary"
            class="ml-12"
            tag="a"
            href="https://github.com/zclzone/vue-naive-admin/tree/2.x"
            target="__blank"
          >
            Code
          </n-button>
        </footer>
      </n-card>
    </div>
    <div class="mt-12 flex">
      <n-card class="w-50%" title="💯 Chất lượng" segmented>
        <template #header-extra>
          <span class="opacity-90 text-highlight">👏 Luôn cập nhật để hoàn thiện hơn</span>
        </template>

        <ul class="opacity-90">
          <li class="py-4">
            🆒 Sử dụng
            <b>Vue3</b>
            Technical stack:
            <span class="text-highlight">Vite + Vue3 + Pinia</span>
          </li>
          <li class="py-4">
            🍇 Sử dụng
            <b>UNOCSS</b>
            Framework:
            <span class="text-highlight">Unocss</span>
            ，Sang, xịn, mịn và dễ xài
          </li>
          <li class="py-4">
            🤹 Biểu tượng
            <span class="text-highlight">iconify + unocss</span>
            Hỗ trợ tùy chỉnh và hiển thị linh hoạt
          </li>
          <li class="py-4">
            🎨 Sử dụng Naive UI，
            <span class="text-highlight">Đơn giản, linh hoạt và cực kỳ dễ dùng</span>
            ，Theme tùy chỉnh trực tiếp
          </li>
          <li class="py-4">
            👏 Cấu trúc modules đơn giản, linh hoạt
            <b>độc lập</b>
            ，xóa modules không ảnh hưởng modules khác.
          </li>
          <li class="py-4">
            🚀
            <span class="text-highlight">Flat router</span>
            Mỗi route được thiết kế không phụ thuộc nhau, tạm biệt router đa cấp.
          </li>

          <li class="py-4">
            🍒
            <span class="text-highlight">Tự động tạo route đựa trên quyền</span>
            ，không cần xác định route bổ sung，
            <span class="text-highlight">Phân biệt lỗi 403 vs 404</span>
            ，thay vì hiển thị 404 nếu trang không được phép
          </li>
          <li class="py-4">
            🔐 Tích hợp Redis
            <span class="text-highlight">No Refresh</span>
            ，Trạng thái đăng nhập của người dùng luôn được kiểm soát và bảo mật
          </li>
          <li class="py-4">
            ✨ Dựa trên Naive UI 
            <span class="text-highlight">Message</span>
            Thông báo chung chia sẻ toàn hệ thống
          </li>
          <li class="py-4">
            ⚡️ Các thành phần khác của Naive UI
            <span class="text-highlight">Page</span>
            components
            <span class="text-highlight">CRUD</span>
            Data table
            <span class="text-highlight">Modal</span>
            Hộp thoại
          </li>
        </ul>

        <n-divider class="mb-0! mt-12!">
          <p class="text-14 opacity-60">
            👉Nhấn vào đây
            <b class="mx-2 transition hover:text-primary">
              <a href="https://isme.top" target="_blank">để biết thêm</a>
            </b>
            những chức năng khác...
          </p>
        </n-divider>
      </n-card>

      <n-card class="ml-12 w-50%" title="🛠️ Technical stack" segmented>
        <VChart :option="skillOption" autoresize />
      </n-card>
    </div>

    <n-card class="mt-12" title="⚡️ Trend" segmented>
      <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
    </n-card>
  </AppPage>
</template>

<script setup>
import { useUserStore } from '@/store'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

const userStore = useUserStore()

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const trendOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    top: '5%',
    data: ['star', 'fork'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: 'star',
      type: 'line',
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: 'fork',
      yAxisIndex: 1,
      type: 'bar',
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
    },
  ],
}

const skillOption = {
  tooltip: {
    trigger: 'item',
    formatter({ name, value }) {
      return `${name} ${value}%`
    },
  },
  legend: {
    left: 'center',
  },
  series: [
    {
      top: '12%',
      type: 'pie',
      radius: ['35%', '90%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 38.5, name: 'Vue' },
        { value: 37.0, name: 'JavaScript' },
        { value: 6.5, name: 'CSS' },
        { value: 6.2, name: 'HTML' },
        { value: 1.8, name: 'Other' },
      ],
    },
  ],
}

const message = $message
</script>
