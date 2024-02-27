<!--------------------------------
 - @Author: Son Nguyen
 - @LastEditor: Son Nguyen
 - @LastEditTime: 2024/1/31 21:28:53
 - @Email: sonanguyene@gmail.com
 - Copyright © 2024 Anh Huy Software
 --------------------------------->

 <template>
  <CommonPage>
    <div class="flex">
      <n-spin size="small" :show="treeLoading">
        <CategoryTree
          v-model:currentCategory="currentCategory"
          class="w-320 shrink-0"
          :tree-data="treeData"
          @refresh="initData"
          @update:children-loaded = "loadedChildren"
          @update:current-category="onSelectCategory"
        />
      </n-spin>

      <div class="ml-40 w-0 flex-1">
        <template v-if="currentCategory">
          <div class="flex justify-between">
            <h3 class="mb-12">{{ currentCategory.cat_name }}</h3>
            <n-button
              :disabled="!currentCategory"
              size="small"
              type="success"
              class="my-4"
              @click="handleEdit(currentCategory)"
            >
              <i class="i-material-symbols:edit-outline mr-4 text-14"></i>
              Chỉnh sửa
            </n-button>
          </div>
          <n-descriptions label-placement="left" bordered :column="4" size="small">
            <n-descriptions-item label="Mã số">{{ currentCategory.id }}</n-descriptions-item>
            <n-descriptions-item label="Tên danh mục">{{ currentCategory.cat_name }}</n-descriptions-item>
            <n-descriptions-item label="Đại lý">{{ currentCategory.agency_id ?? '--' }}</n-descriptions-item>
            <n-descriptions-item label="Active"> {{ currentCategory.active ? 'Có' : 'Không' }} </n-descriptions-item>
            <n-descriptions-item label="Danh mục cha"> {{ currentCategory.parent_cat_name}} </n-descriptions-item>
            <n-descriptions-item label="Thứ tự"> {{ currentCategory.sort_order }} </n-descriptions-item>
            <n-descriptions-item label="Path">
              <n-breadcrumb>
                <n-breadcrumb-item v-if="!breadItems?.length" :clickable="false">
                {{ currentCategory.cat_name }}
                </n-breadcrumb-item>
                <n-breadcrumb-item
                  v-for="(item) of breadItems"
                  v-else
                  :key="item.seo_url"
                  :clickable="!!item.path"
                >
                {{ item.cat_name }}
                </n-breadcrumb-item>
              </n-breadcrumb>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" bordered :column="1" size="small">
            <n-descriptions-item label="Mô tả chi tiết">
              <QuillEditor :options="QuillOptions" v-model:content="categoryDesc" theme="bubble" content-type="html" read-only toolbar="minimal" />
            </n-descriptions-item>
          </n-descriptions>
        </template>
        <n-empty v-else class="h-450 f-c-c" size="large" description="Chọn một menu để xem chi tiết" />
      </div>
    </div>
    <ResAddOrEdit ref="modalRef" :categories="treeData" @refresh="initData" />
  </CommonPage>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
//import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import CategoryTree from './components/CategoryTree.vue'
import ResAddOrEdit from './components/ResAddOrEdit.vue'
import api from './api'

const QuillOptions = {
        debug: 'error',
        readOnly: true
      }

const treeData = ref([])
const breadItems = ref([])
const treeLoading = ref(false)

async function initData(data) {
  treeLoading.value = true
  const res = await api.getAllCategories()
  treeData.value = res?.data || []
  treeLoading.value = false
  if (data) {
    currentCategory.value = data
    if(currentCategory.value.info.desc) categoryDesc.value=currentCategory.value.info.desc;
    else categoryDesc.value= '<p>Không tìm thấy mô tả!</p>';
  }
}

function loadedChildren(node) {
  console.log("Loaded children: ",node);
}

function onSelectCategory(node){
  breadItems.value = [];
  if(node.breadscrumb) {
    let item = node.breadscrumb;
    while(item != null) { breadItems.value.unshift(item); item = item.parent; }
  }
  if(node.info.desc) categoryDesc.value=node.info.desc;
  else categoryDesc.value= '<p>Không tìm thấy mô tả!</p>';
}

initData()

const currentCategory = ref(null)
const categoryDesc = ref(null)

const modalRef = ref(null)

function handleEdit(item = {}) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: 'Chỉnh sửa - ' + item.cat_name,
    row: item,
    okText: 'Lưu thay đổi',
  })
}
</script>