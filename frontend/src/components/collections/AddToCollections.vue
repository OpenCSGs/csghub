<template>
  <div
    class="AddRepoToCollections z-20"
  >
    <div
      @click="openAddCollections"
      class="btn btn-secondary-gray btn-sm"
    >
      <SvgIcon
        name="collections"
        width="12px"
        height="12px"
      />
      {{ $t('collections.edit.addCollection') }}
    </div>
    <el-dialog
      v-model="dialogVisible"
      top="200px"
      :style="{ borderRadius: '10px' }"
      width="450"
      class="invite_dialog"
    >
      <template #header="{ close }">
        <div class="flex justify-between">
          <div
            class="rounded-full px-[12px] py-[12px] rounded-lg border-[2px] bg-success-100 border-[8px] border-success-50"
          >
            <SvgIcon name="check_circle" />
          </div>
          <img
            src="/images/collection_half_cirle.png"
            class="w-[50%] absolute top-0 left-0"
          />
        </div>
      </template>
      <div class="relative">
        <div class="mt-[20px]">
          <div>
            <div class="mb-[20px]">
              <p class="text-gray-700 text-sm mb-[6px]">
                {{ $t('collections.edit.addCollection') }}
              </p>
              <el-select
                v-model="collectionsIdsInput"
                :placeholder="$t('all.select')"
                filterable
                size="large"
                class="w-full"
              >
                <el-option
                  v-for="item in collectionsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-between gap-3 px-5">
          <div
            class="w-[50%] active:outline active:outline-4 active:outline-gray-200 hover:bg-gray-500 text-center py-[10px] px-4 border border-gray-300 cursor-pointer shadow-xs rounded-md"
            @click="cancelAddCollections"
          >
            {{ $t('all.cancel') }}
          </div>
          <div
            class="w-[50%] hover:bg-brand-700 hover:border-brand-700 active:outline active:outline-4 active:outline-brand-600 text-white text-center py-[10px] px-4 border border-brand-600 bg-brand-600 cursor-pointer shadow-xs rounded-md"
            @click="confirmAddCollections"
          >
            {{ $t('all.confirm') }}
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi';
  import useUserStore from '../../stores/UserStore.js'

  const userStore = useUserStore()
  const { t } = useI18n()

  const props = defineProps({
    repoId: String,
    userName: String
  })
  const dialogVisible = ref(false)
  const collectionsList = ref([])
  const collectionsIdsInput = ref('')
  const isLogged =ref(false)
  const fetchCollectionsList = async () => {
    const url = `/user/${props.userName}/collections`
    const { data, error } = await useFetchApi(url).json()
    const json = data.value
    if (json) {
      collectionsList.value = json.data
    }else{
      ElMessage({ message: error.value.msg, type: 'warning' })
    }
  }
  
  const openAddCollections = () => {
    if(isLogged.value){
      dialogVisible.value = true
    }else{
      window.location.href = '/login'
    }
  }

  const confirmAddCollections = () => {
    if (!collectionsIdsInput.value) {
      ElMessage({ message: t('all.selectProject'), type: 'warning' })
      return
    }
    repoAddToCollections()
  }

  const cancelAddCollections = () => {
    dialogVisible.value = false
    collectionsIdsInput.value = ''
  }

  async function repoAddToCollections() {
    const addRepoData = {
      repo_ids: [props.repoId]
    }
    const options = { body: JSON.stringify(addRepoData) }
    const url = `/collections/${collectionsIdsInput.value}/repos`
    const { data, error } = await useFetchApi(url, options).post().json()
    if(data.value){
      dialogVisible.value = false
      ElMessage({
        message: t('all.addSuccess'),
        type: 'success'
      })
      collectionsIdsInput.value = ''
    }else{
      ElMessage({ message: error.value.msg, type: 'warning' })
    }
  }

  watch(() => userStore.isLoggedIn, () => {
    isLogged.value = userStore.isLoggedIn
  })

  watch(() => props.userName, () => {
    fetchCollectionsList()
  })
</script>
<style scoped>
  @media (max-width: 768px) {
    .AddRepoToCollections .invite_dialog {
      width: 350px;
    }
  }

  .AddRepoToCollections .scroll-container::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    /* 滚动条宽度 */
    background-color: #ccc;
    /* 滚动条颜色 */
    border-radius: var(--border-radius-xs);
    /* 滚动条圆角 */
  }

  .AddRepoToCollections .scroll-container .content {
    padding-right: 8px;
    /* 留出滚动条的空间 */
  }

  .AddRepoToCollections .scroll-container::-webkit-scrollbar {
    width: 8px;
    /* 滚动条宽度 */
  }

  .AddRepoToCollections .scroll-container::-webkit-scrollbar-thumb {
    background-color: #888;
    /* 滚动条thumb颜色 */
    border-radius: var(--border-radius-xs);
    /* 滚动条thumb圆角 */
  }
</style>
