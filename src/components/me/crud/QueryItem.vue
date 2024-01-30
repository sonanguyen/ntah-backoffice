<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:51:48
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div class="flex items-start"  :style="{'min-width': minWidth+'px','max-width': maxWidth+'px'}">
    <n-grid>
      <n-form-item-gi :span="24" :x-gap="24" :label="label" class="mt-12">
        <slot />    
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  minWidth: {
    type: Number,
    default: 80,
  },
  maxWidth: {
    type: Number,
    default: 220,
  },
})
</script>
