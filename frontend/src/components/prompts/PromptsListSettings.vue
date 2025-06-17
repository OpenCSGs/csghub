<template>
  <PromptsBreadCrumbs
    :title="name"
    :namespace="namespace"
    :name="name"
    firstHref="/prompts/library"
    firstHrefName="prompts.promptLibrary"
    class="sticky top-0 md:top-16 bg-white left-0 z-10"
    currentComponent="promptsListSettings"
  />
  <div
    class="w-full text-gray-900 p-8 md:p-1 md:mt-5 lg:px-5 mb-24 md:mb-8 md:px-12 sm:px-5"
  >
    <div class="text-2xl mb-3 font-medium">{{ $t('prompts.listSettings.settings') }}</div>
    <div class="flex mt-9 justify-center">
      <div class="flex flex-col w-[824px] xl:w-full justify-center">
        <!-- promptsName -->
        <div class="flex lg:flex-col justify-between gap-8">
          <div class="w-[280px] sm:w-full flex flex-col">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.promptsName') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.promptsNameTips') }}
            </div>
          </div>
          <div
            class="!w-[484px] !lg:w-full rounded-md bg-gray-50 px-4 py-2 border">
            {{ repoName }}
          </div>
        </div>

        <!-- Nickname -->
        <div class="flex lg:flex-col gap-8 mt-8 justify-between">
          <div class="w-[280px] lg:w-full flex flex-col">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.promptsNickName') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.listSettings.tips') }}
            </div>
          </div>
          <div class="flex flex-col gap-[6px]">
            <el-input
              v-model="promptsNickname"
              clearable
              size="large"
              class="!w-[484px] lg:!w-full" />
            <CsgButton
              @click="updateNickname"
              class="btn btn-secondary-gray btn-sm w-fit"
              :name="$t('all.update')"
            />
          </div>
        </div>

        <el-divider />
        
        <!-- Desc -->
        <div class="flex lg:flex-col gap-8 justify-between">
          <div class="w-[280px] lg:w-full flex flex-col">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.promptsDesc') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.listSettings.tips2') }}
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <el-input
              v-model="promptsDesc"
              clearable
              size="large"
              type="textarea"
              class="!w-[484px] lg:!w-auto" />
            <CsgButton
              @click="updatePromptsDesc"
              class="btn btn-secondary-gray btn-sm w-fit"
              :name="$t('all.update')"
            />
          </div>
        </div>

        <el-divider />

        <!-- Visibility -->
        <div class="flex lg:flex-col gap-8 justify-between">
          <div class="w-[280px] lg:w-full flex flex-col">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.listSettings.changeVisibility') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.listSettings.statusText') }}
              <span class="text-black font-semibold"
                >[{{
                  isPrivate ? t('all.private') : t('all.public')
                }}]</span
              >
              {{ t('prompts.listSettings.status') }} {{
                isPrivate
                  ? t('prompts.listSettings.privateVis')
                  : t('prompts.listSettings.publicVis')
              }}
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[#344054] text-[14px]">
              {{ $t('prompts.listSettings.promptsVisibility') }}
            </p>
            <el-select
              v-model="visibilityName"
              @change="changeVisibility"
              placeholder="Select"
              size="large"
              class="!w-[484px] lg:!w-full">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </div>
        </div>

        <el-divider />

        <!-- RelatedModel -->
        <div class="flex lg:flex-col gap-8 justify-between">
          <div class="w-[280px] lg:w-full flex flex-col">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.relatedModel') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.listSettings.tips3') }}
            </div>
          </div>
          <div class="flex flex-col gap-2 w-[484px] md:w-full">
          <div
            class="flex gap-[4px] flex-wrap items-center w-full border rounded-[4px] border-gray-300 min-h-[40px] p-[6px]">
            <div
              class="scroll-container flex gap-[4px] flex-wrap max-h-[120px] overflow-y-auto">
              <span
                v-for="promptsRelationsModel in promptsRelationsModels"
                class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]">
                {{ promptsRelationsModel.path }}
                <el-icon><Close @click="removeModel(promptsRelationsModel.path)" /></el-icon>
              </span>
            </div>
            <input
              class="w-full max-h-[36px] outline-none"
              v-model="pathInput"
              @input="showModelsList" />
          </div>
          <div
            v-show="shouldShowModelsList"
            class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]">
            <p
              v-for="model in showModels"
              @click="selectModel(model)"
              class="flex gap-[8px] items-center cursor-pointer p-[10px]">
              {{ model.path }}
            </p>
          </div>
          <CsgButton
            @click="updateRelationsModels"
            class="btn btn-secondary-gray btn-sm w-fit"
            :name="$t('all.update')"
          />
          </div>
        </div>      

        <el-divider />

        <!-- Delete -->
        <div class="flex lg:flex-col justify-between gap-8">
          <div class="w-[280px] sm:w-full flex flex-col gap-2">
            <div class="text-sm text-gray-600 leading-5 font-medium">
              {{ $t('prompts.listSettings.delPrompts') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('prompts.listSettings.delTips') }}
              <span class="text-black font-medium">{{ $t('prompts.listSettings.canNot') }}</span>
              {{ $t('prompts.listSettings.delTips2') }}
              <span class="text-black font-medium break-words">{{ promptsDetails.path }}</span>
              {{ $t('prompts.listSettings.delTips3') }}
            </div>
            <div class="text-sm text-gray-600 leading-5">
              {{ $t('all.enterPls') }}
              <span class="text-black font-medium break-words">{{ promptsDetails.path }}</span>
              {{ $t('all.sureDel') }}
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-[#344054] text-[14px]">{{ $t('prompts.promptsName') }}</p>
            <el-input
              v-model="delDesc"
              clearable
              size="large"
              class="!w-[484px] lg:!w-full" />
            <div class="flex">
              <div
                id="confirmDelete"
                @click="clickDelete"
                class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-md"
                :class="
                  delDesc === promptsDetails.path
                    ? 'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white'
                    : 'bg-[#F2F4F7]'
                "
                @mouseover="handleMouseOver"
                @mouseleave="handleMouseLeave">
                {{ $t('prompts.listSettings.confirmDel') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
  import { ref, h, onMounted } from 'vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    namespace: String,
    name: String,
    promptsDetails: Object,
    relationsModels: Array
  })

  const { t } = useI18n()

  const repoName = ref(props.promptsDetails.name)
  const promptsNickname = ref(props.promptsDetails.nickname) || ''
  const promptsDesc = ref(props.promptsDetails.description) || ''
  const visibilityName = ref(props.promptsDetails.private ? 'Private' : 'Public')
  const delDesc = ref('')
  const promptsRelationsModels = ref(props.relationsModels)
  const showModels = ref([])
  const allModels = ref([])
  const shouldShowModelsList = ref(false)
  const pathInput = ref('')

  const options = ref([
    { value: 'Private', label: t('all.private') },
    { value: 'Public', label: t('all.public') }
  ])
  
  const updateNickname = () => {
    if (!!promptsNickname.value.trim()) {
      const payload = { nickname: promptsNickname.value }
      updatePrompts(payload)
    } else {
      ElMessage({
        message: t('prompts.listSettings.needPromptsName'),
        type: 'warning'
      })
    }
  }

  const updatePromptsDesc = () => {
    if (!!promptsDesc.value.trim()) {
      const payload = { description: promptsDesc.value }
      updatePrompts(payload)
    } else {
      ElMessage({
        message: t('prompts.listSettings.needPromptsDesc'),
        type: 'warning'
      })
    }
  }

  const changeVisibility = (value) => {
    ElMessageBox({
      itle: t('prompts.listSettings.changeVisibility'),
      message: h('p', null, [
        h('span', null, t('all.changeVis')),
        h(
          'span',
          null,
          value === 'Private'
            ? t('all.private')
            : t('all.public')
        ),
        h(
          'span',
          null,
          value === 'Private'
            ? t('prompts.listSettings.privateInfo')
            : t('prompts.listSettings.publicInfo')
        ),
      ]),
      showCancelButton: true,
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel'),
  })
    .then(() => {
      changeVisibilityCall(value);
    })
    .catch(() => {
      visibilityName.value = visibilityName.value == 'Private' ? 'Public' : 'Private'
      ElMessage({
        type: 'warning',
        message: t('all.changeCancel'),
      });
    });
  }

    const changeVisibilityCall = (value) => {
      const isprivateSelected = value === 'Private' ? true : false
      const payload = { private: isprivateSelected }
      updatePrompts(payload)
    }

    const clickDelete = () => {
      if (delDesc.value === props.promptsDetails.path) {
        try {
          deletePrompts(); 
        } catch (err) {
          ElMessage({
            message: err.message,
            type: 'warning',
          });
        }
      }
    }    

  const updatePrompts = async (payload) => {
    const promptsUpdateEndpoint = `/prompts/${props.promptsDetails.path}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { error } = await useFetchApi(promptsUpdateEndpoint, options).put().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.updateSuccess'), type: 'success' })
    }
  }

  const deletePrompts = async () => {
    const promptsDeleteEndpoint = `/prompts/${props.promptsDetails.path}`
    const { error } = await useFetchApi(promptsDeleteEndpoint).delete().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' });
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' });
      setTimeout(() => {
        window.location.href = document.referrer || '/prompts/library'
      }, 1000);
      return true;
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      const confirmDeleteElement = document.getElementById('confirmDelete');
      if (confirmDeleteElement) {
        confirmDeleteElement.classList.replace('bg-[#D92D20]', 'bg-[#B42318]');
      }
    }
  }

  const handleMouseLeave = () => {
    const confirmDeleteElement = document.getElementById('confirmDelete');
    if (confirmDeleteElement) {
      confirmDeleteElement.classList.replace('bg-[#B42318]', 'bg-[#D92D20]');
    }
  }

  // methods of relation models
  const fetchModel = async () => {
    const fetchModelEndpoint = `/models`;
    const { data, error } = await useFetchApi(fetchModelEndpoint).json()

    if (error.value) {
      ElMessage.error('Failed to fetch model')
    } else {
      allModels.value = data.value.data
    }
  }

  const removeModel = (modelPath) => {
    promptsRelationsModels.value = promptsRelationsModels.value.filter(
      (model) => model.path !== modelPath
    )
  }

  const selectModel = (newModel) => {
    const findModel = promptsRelationsModels.value.find(
      (model) => model.path === newModel.path
    )
    if (!findModel) {
      promptsRelationsModels.value.push(newModel)
    }
  }

  const showModelsList = () => {
    if (pathInput.value !== '') {
      const userTriggerModelsList = allModels.value.filter((model) => {
        return model.path.includes(pathInput.value)
      });
      if (userTriggerModelsList.length > 0) {
        showModels.value = userTriggerModelsList
        shouldShowModelsList.value = true
      }
    } else {
      shouldShowModelsList.value = false
    }
  }

  const updateRelationsModels = async () => {
    const modelPathList = promptsRelationsModels.value.map(model => model.path)
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "models": modelPathList })
    }
    const { error } = await useFetchApi(
      `/prompts/${props.namespace}/${props.name}/relations`, options
    ).put().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.updateSuccess'), type: 'success' });
    }
  }
    
  onMounted(() => {
    fetchModel()
  })
</script>
