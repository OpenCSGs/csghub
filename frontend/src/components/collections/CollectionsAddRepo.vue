<template>
  <div class="CollectionAddRepo">
    <div
      v-if="canManage"
      @click="dialogVisible = true"
      class="flex px-4 py-[5px] text-white border border-brand-600 justify-center items-center gap-1.5 rounded-lg bg-brand-600 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
    >
      <SvgIcon name="plus" />
      {{ $t('collections.edit.add') }}
    </div>
    <el-dialog
      v-model="dialogVisible"
      top="10vh"
      :style="{ borderRadius: '10px' }"
      width="450"
      class="invite_dialog"
    >
      <template #header="{ close }">
        <div class="flex justify-between">
          <div
            class="px-4 py-4 rounded-lg border-[1px] border-gray-200 shadow-sm"
          >
            <SvgIcon name="collections" />
          </div>
          <img
            src="/images/collection_half_cirle.png"
            class="w-[50%] absolute top-0 left-0"
          />
        </div>
      </template>
      <div class="relative">
        <div class="mt-5">
          <div>
            <div class="mb-5">
              <p class="text-gray-700 text-sm mb-1.5">
                {{ $t('collections.edit.type') }}
              </p>
              <el-select
                v-model="typeInput"
                @change="typeChange"
                :placeholder="$t('all.select')"
                size="large"
                class="w-full"
              >
                <el-option
                  v-for="item in typeMappings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <p class="text-gray-700 text-sm mb-1.5">
              {{ $t('collections.edit.name') }}
            </p>
            <el-select
              v-model="repoIdsInput"
              filterable
              remote
              :placeholder="$t('all.select')"
              size="large"
              class="w-full"
              :remote-method="repoInputChange"
            >
              <el-option
                v-for="item in reposMappings"
                :key="item.repository_id"
                :label="item.path"
                :value="item.repository_id"
              />
            </el-select>
            <!-- remark textarea -->
            <div v-if="repoIdsInput" class="mt-5">
              <p class="text-gray-700 text-sm mb-1.5">
                {{ $t('collections.remark') }}
              </p>
              <el-input
                v-model="tempRemark"
                type="textarea"
                :rows="3"
                :placeholder="$t('collections.remark')"
                maxlength="500"
                show-word-limit
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-between gap-3 px-5">
          <div
            class="w-full btn btn-secondary-gray btn-md"
            @click="dialogVisible = false"
          >
            {{ $t('all.cancel') }}
          </div>
          <div
            class="w-full btn btn-primary btn-md"
            @click="confirmAddRepo"
          >
            {{ $t('all.confirm') }}
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, inject } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '@/stores/RepoDetailStore'

  const { t } = useI18n()

  const props = defineProps({
    collectionsId: String,
    canManage: Boolean
  })

  const repoDetailStore = useRepoDetailStore()
  const dialogVisible = ref(false)
  const typeMappings = [
    {
      value: 'models',
      label: t('navbar.models')
    },
    {
      value: 'datasets',
      label: t('navbar.datasets')
    },
    {
      value: 'codes',
      label: t('navbar.codes')
    },
    {
      value: 'spaces',
      label: t('navbar.spaces')
    }
  ]
  const reposMappings = ref([])
  const typeInput = ref('models')
  const repoIdsInput = ref('')
  const tempRemark = ref('')
  const fetchCollectionDetail = inject('fetchCollectionDetail')

  const typeChange = () => {
    repoIdsInput.value = ''
    tempRemark.value = ''
  }
  const repoInputChange = (search) => {
    repoIdsInput.value = ''
    tempRemark.value = ''
    fetchRepoList(typeInput.value, search)
  }
  const fetchRepoList = async (type, search) => {
    let url = `/${type}`
    url = url + `?search=${search || ''}`
    const { data, error } = await useFetchApi(url).json()
    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      const res = data.value
      reposMappings.value = res.data
    }
  }

  const confirmAddRepo = () => {
    if (!repoIdsInput.value) {
      ElMessage({ message: t('all.selectProject'), type: 'warning' })
      return
    }
    collectionAddRepo()
      .then(() => {
        dialogVisible.value = false
        ElMessage({
          message: t('all.addSuccess'),
          type: 'success'
        })
        repoDetailStore.clearStore()
        fetchCollectionDetail()
      })
      .catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
  }

  async function collectionAddRepo() {
    const addRepoData = {
      repo_ids: [repoIdsInput.value],
      remarks: tempRemark.value
        ? { [repoIdsInput.value]: tempRemark.value }
        : {}
    }

    const options = { body: JSON.stringify(addRepoData) }
    const url = `/collections/${props.collectionsId}/repos`
    const { data, error } = await useFetchApi(url, options).post().json()
    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      return data.value
    }
  }
</script>
<style>
  @media (max-width: 768px) {
    .CollectionAddRepo .invite_dialog {
      width: 350px;
    }
  }
  .CollectionAddRepo .scroll-container::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 8px; /* 滚动条宽度 */
    background-color: #ccc; /* 滚动条颜色 */
    border-radius: var(--border-radius-xs); /* 滚动条圆角 */
  }

  .CollectionAddRepo .scroll-container .content {
    padding-right: 8px; /* 留出滚动条的空间 */
  }

  .CollectionAddRepo .scroll-container::-webkit-scrollbar {
    width: 8px; /* 滚动条宽度 */
  }

  .CollectionAddRepo .scroll-container::-webkit-scrollbar-thumb {
    background-color: #888; /* 滚动条thumb颜色 */
    border-radius: var(--border-radius-xs); /* 滚动条thumb圆角 */
  }
</style>
