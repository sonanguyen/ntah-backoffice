<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:32
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-tree
    :key-field="keyField"
    :label-field="labelField"
    :selectable="false"
    default-expand-all
    checkable
    check-on-click
    cascade
    :data="treeData"
    :checked-keys="checkedKeys"
    :on-update:checked-keys="(keys) => (checkedKeys = keys)"
    :on-update:indeterminate-keys="(keys) => (halfCheckedKeys = keys)"
  />
</template>

<script setup>
const props = defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  value: {
    type: Array,
    default: () => [],
  },
  labelField: {
    type: String,
    default: 'label',
  },
  keyField: {
    type: String,
    default: 'value',
  },
})
const emit = defineEmits(['update:value'])

const halfCheckedKeys = ref([])
const checkedKeys = ref([])
watch([halfCheckedKeys, checkedKeys], ([v1, v2]) => {
  emit('update:value', Array.from(new Set([...v1, ...v2])))
})
onMounted(() => {
  halfCheckedKeys.value = getHalfCheckedValues(props.value, props.treeData)
  checkedKeys.value = props.value.filter((item) => !halfCheckedKeys.value.includes(item))
})

function getHalfCheckedValues(selectedValues, treeData, halfCheckedValues = []) {
  function isHalfChecked(node) {
    return node.children.some(
      (item) =>
        !selectedValues.includes(item[props.keyField]) ||
        halfCheckedValues.includes(item[props.keyField])
    )
  }

  function hasGrandson(node) {
    return node.children.some((item) => !!item.children?.length)
  }

  for (const item of treeData) {
    if (!item.children?.length) continue
    if (hasGrandson(item)) {
      getHalfCheckedValues(selectedValues, item.children, halfCheckedValues)
      isHalfChecked(item) && halfCheckedValues.push(item[props.keyField])
    } else {
      isHalfChecked(item) && halfCheckedValues.push(item[props.keyField])
    }
  }

  return halfCheckedValues
}
</script>
