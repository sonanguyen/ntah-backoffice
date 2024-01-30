<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:51:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppCard
    v-if="$slots.default"
    bordered
    bg="#fafafc dark:black"
    class="mb-30 min-h-60 flex justify-between rounded-4 p-16"
  >
    <n-space wrap :size="[32, 16]">
      <slot></slot>
    </n-space>
    <div class="flex flex-shrink-0 flex-items-center">
      <n-button class="ml-10" ghost type="primary" @click="handleSearch">
        <i class="i-fe:search mr-4"></i>
      </n-button>
      <n-button class="ml-10" ghost type="primary" @click="handleExport">
        <i class="i-fe:file-excel mr-4"></i>
      </n-button>
      <n-button class="ml-10" ghost type="primary" @click="handleReset">
        <i class="i-fe:rotate-ccw mr-4"></i>
      </n-button>
    </div>
  </AppCard>

  <n-data-table
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columns"
    :data="tableData"
    :row-key="(row) => row[rowKey]"
    :pagination="isPagination ? pagination : false"
    :children-key="childrenKey"
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
    @update:sorter="onSorterChange"
  />
</template>

<script setup>
import { NDataTable } from 'naive-ui'
import { utils, writeFile } from 'xlsx'

const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  remote: {
    type: Boolean,
    default: true,
  },
  childrenKey: {
    type: String,
    default: 'children',
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  isSortable: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  getData: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10 })
const columnsRef = ref(props.columns)
const reactiveSorter = reactive({columnKey:'product_name',order: true,sorter: 'default'})

async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数
    if (props.isPagination && props.remote) {
      paginationParams = { pageNo: pagination.page, pageSize: pagination.pageSize }
    }
    let sortParams = {};
    if (props.isSortable && props.remote) {
      sortParams = { sortOrder: `${reactiveSorter.columnKey}${reactiveSorter.order == 'ascend'?'':' desc'}` }
    }

    const { data } = await props.getData({
      ...props.queryItems,
      ...paginationParams,
      ...sortParams
    })
    tableData.value = data?.pageData || data
    pagination.itemCount = data.total ?? data.length
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}
function handleSearch() {
  pagination.page = 1
  handleQuery()
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}

function onSorterChange(sorter) {
  if(reactiveSorter.columnKey == sorter.columnKey) reactiveSorter.order = sorter.order;
  if (props.remote) {
    handleQuery()
  }
}

function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  if (props.columns.some((item) => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}
function handleExport(columns = props.columns, data = tableData.value) {
  console.log("Columns: ", props.columns);
  console.log("Data: ", data);
  if (!data?.length) return $message.warning('Không có dữ liệu.')
  const columnsData = props.columns.filter((item) => !!item.title && !item.hideInExcel)
  const thKeys = columnsData.map((item) => item.key)
  const thData = columnsData.map((item) => item.title)
  const trData = data.map((item) => thKeys.map((key) => item[key]))
  const sheet = utils.aoa_to_sheet([thData, ...trData])
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, sheet, 'Dữ liệu báo cáo')
  writeFile(workBook, 'ReportData.xlsx')
}

defineExpose({
  handleSearch,
  handleReset,
  handleExport,
})
</script>
