<template>
  <div class="CollectionAddRepo">
    <div
      v-if="settingsVisibility"
      @click="dialogVisible = true"
      class="flex px-4 py-[10px] text-[#FFFFFF] border border-[#3250BD] justify-center items-center gap-[6px] rounded-lg bg-[#3250BD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
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
          <div class="px-[12px] py-[12px] rounded-[10px] border-[2px] border-[#EAECF0]">
            <SvgIcon name="collections" />
          </div>
          <img
            src="/images/invite_bg.png"
            class="w-[200px] absolute top-0 left-0"
          />
        </div>
      </template>
      <div class="relative">
        <div class="mt-[20px]">
          <div>
            <div class="mb-[20px]">
              <p class="text-[#344054] text-[14px] mb-[6px]">{{ $t('collections.edit.type') }}</p>
              <el-select
                v-model="typeInput"
                @change="typeChange"
                :placeholder="this.$t('all.select')"
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
            <p class="text-[#344054] text-[14px] mb-[6px]">{{ $t('collections.edit.name') }}</p>
            <el-select
              v-model="repoIdsInput"
              filterable
              :placeholder="this.$t('all.select')"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in reposMappings"
                :key="item.repository_id"
                :label="item.path ? item.path : item.name"
                :value="item.repository_id"
              />
            </el-select>
            <div
              v-show="shouldShowUserList"
              class="md:max-h-[110px] max-h-[210px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]"
            >
              <p
                v-for="user in userList"
                @click="selectUser(user)"
                class="flex gap-[8px] items-center cursor-pointer p-[10px]"
              >
                <img
                  :src="user.avatar"
                  height="16"
                  width="16"
                />
                {{ user.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-between">
          <el-button
            class="w-[50%]"
            size="large"
            @click="dialogVisible = false"
            >{{ $t('all.cancel') }}</el-button
          >
          <el-button
            class="w-[50%]"
            size="large"
            type="primary"
            @click="confirmAddRepo"
          >
            {{ $t('all.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, inject, onMounted } from 'vue'
  import jwtFetch from '../../packs/jwtFetch'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const csghubServer = inject('csghubServer')

  const props = defineProps({
    collectionsId: String,
    settingsVisibility: Boolean
  })
  const dialogVisible = ref(false)
  const typeMappings = [
    {
      value: 'models',
      label: 'models'
    },
    {
      value: 'datasets',
      label: 'datasets'
    },
    {
      value: 'codes',
      label: 'codes'
    },
    {
      value: 'spaces',
      label: 'spaces'
    }
  ]
  const reposMappings = ref([])
  const typeInput = ref('model')
  const repoIdsInput = ref('')
  repoIdsInput
  const typeChange = (type) => {
    fetchRepoList(type)
  }

  const fetchRepoList = async (type) => {
    const url = `${csghubServer}/api/v1/${type}`
    const res = await jwtFetch(url)
    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      reposMappings.value = data
    }
  }

  const confirmAddRepo = () => {
    collectionAddRepo()
      .then(() => {
        dialogVisible.value = false
        ElMessage({
          message: t('all.addSuccess'),
          type: 'success'
        })
        location.href = `/collections/${props.collectionsId}`
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
      repo_ids: [repoIdsInput.value]
    }

    const options = { method: 'POST', body: JSON.stringify(addRepoData) }
    const url = `${csghubServer}/api/v1/collections/${props.collectionsId}/repos`
    const response = await jwtFetch(url, options)
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message)
      })
    } else {
      return response.json()
    }
  }
  onMounted(() => {
    fetchRepoList('models')
  })
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
    border-radius: 4px; /* 滚动条圆角 */
  }

  .CollectionAddRepo .scroll-container .content {
    padding-right: 8px; /* 留出滚动条的空间 */
  }

  .CollectionAddRepo .scroll-container::-webkit-scrollbar {
    width: 8px; /* 滚动条宽度 */
  }

  .CollectionAddRepo .scroll-container::-webkit-scrollbar-thumb {
    background-color: #888; /* 滚动条thumb颜色 */
    border-radius: 4px; /* 滚动条thumb圆角 */
  }
</style>
