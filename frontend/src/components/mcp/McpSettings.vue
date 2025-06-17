<template>
  <div class="my-8 md:my-0 md:border-none py-6">
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.mcpName') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.mcpNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('mcps.namespaceMcpName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-[14px] py-[10px] border"
        >
          {{ mcpPath }}
        </div>
      </div>
    </div>

    <el-divider />

    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.mcpNickName') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theMcpNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <CsgButton
          @click="updateNickname"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
          :disabled="!theMcpNickname"
        />
      </div>
    </div>

    <el-divider />

    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.mcpDesc') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theMcpDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full"
        />
        <CsgButton
          @click="updateMcpDesc"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
          :disabled="!theMcpDesc"
        />
      </div>
    </div>

    <el-divider />

    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.mcpTag') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.edit.tips3') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="tagListContainer"
      >
        <p class="text-gray-700 text-sm">{{ $t('mcps.mcpTag') }}</p>
        <div class="flex flex-col gap-1.5 w-[512px] md:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-md border-gray-300 min-h-[40px] p-[6px]"
          >
            <div
              class="scroll-container flex gap-1 flex-wrap max-h-[120px] overflow-y-auto"
            >
              <span
                v-for="tag in selectedTags"
                class="flex items-center text-sm text-gray-700 gap-1 border rounded-sm border-gray-300 px-1 py-0.5"
              >
                {{
                  $i18n.locale === 'zh'
                    ? tag.zh_name || tag.show_name || tag.name
                    : tag.name
                }}
                <el-icon><Close @click="removeTag(tag.name)" /></el-icon>
              </span>
            </div>
            <input
              class="w-full max-h-8 outline-none"
              v-model="tagInput"
              @input="showTagList"
            />
          </div>
          <div
            v-show="shouldShowTagList"
            class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-1 px-1.5"
          >
            <p
              v-for="tag in theTagList"
              @click="selectTag(tag)"
              class="flex gap-2 items-center cursor-pointer p-2.5"
            >
              {{ $i18n.locale === 'zh' ? tag.show_name || tag.name : tag.name }}
            </p>
          </div>
          <CsgButton
            @click="updateTags"
            class="btn btn-secondary-gray btn-sm w-fit"
            :name="$t('all.update')"
          />
        </div>
      </div>
    </div>

    <el-divider />

    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.edit.changeVisibility') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.edit.statusText') }}
          <span class="text-gray-700 font-medium"
            >[{{ isPrivate ? $t('all.private') : $t('all.public') }}]</span
          >
          {{ $t('mcps.edit.status') }}
          {{
            isPrivate ? $t('mcps.edit.privateVis') : $t('mcps.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('mcps.edit.mcpVisibility') }}
        </p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[512px] sm:!w-full"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col gap-1.5">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('mcps.edit.delMcp') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('mcps.edit.delTips') }}
          <span class="text-gray-700 font-medium">{{
            $t('mcps.edit.canNot')
          }}</span>
          {{ $t('mcps.edit.delTips2') }}
          <span class="text-gray-700 font-medium break-words">{{ path }}</span>
          {{ $t('mcps.edit.delTips3') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('all.enterPls') }}
          <span class="text-gray-700 font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-gray-700 text-sm">{{ $t('mcps.mcpName') }}</p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <div class="flex">
          <CsgButton
            @click="clickDelete"
            class="btn btn-danger btn-sm w-fit"
            :name="$t('mcps.edit.confirmDel')"
            :disabled="delDesc !== mcpPath"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    watch,
    inject,
    h
  } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { storeToRefs } from 'pinia'
  import parseMD from 'parse-md'
  import yaml from 'js-yaml'
  import { atob_utf8, btoa_utf8 } from '../../packs/utils'
  import { Close } from '@element-plus/icons-vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    path: String,
    mcpNickname: String,
    mcpDesc: String,
    defaultBranch: String,
    tagList: Object,
    tags: Object
  })

  const tagListContainer = ref(null)
  const theTagList = ref(props.tagList)
  const selectedTags = ref([])
  const shouldShowTagList = ref(false)
  const tagInput = ref('')
  const delDesc = ref('')
  const theMcpNickname = ref(props.mcpNickname || '')
  const theMcpDesc = ref(props.mcpDesc || '')
  const mcpPath = ref(props.path)
  const readmeContent = ref('')
  const readmeSha = ref('')

  const options = ref([
    { value: 'Private', label: 'Private' },
    { value: 'Public', label: 'Public' }
  ])

  onMounted(() => {
    options.value = [
      { value: 'Private', label: t('all.private') },
      { value: 'Public', label: t('all.public') }
    ]
  })

  const repoDetailStore = useRepoDetailStore()
  const { isPrivate, privateVisibility } = storeToRefs(repoDetailStore)
  const { updateVisibility } = repoDetailStore

  const visibilityName = computed({
    get: () => (privateVisibility.value ? 'Private' : 'Public'),
    set: (newValue) => {
      privateVisibility.value = newValue === 'Private'
    }
  })

  const fetchRepoDetail = inject('fetchRepoDetail')

  onMounted(() => {
    if (Object.keys(props.tags).length > 0) {
      getSelectTags()
    }
    document.addEventListener('click', collapseTagList)
    fetchReadme()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', collapseTagList)
  })

  watch(
    () => props.mcpNickname,
    (newNickname) => {
      theMcpNickname.value = newNickname
    }
  )

  watch(
    () => props.mcpDesc,
    (newDesc) => {
      theMcpDesc.value = newDesc
    }
  )

  watch(
    () => props.tagList,
    (newTagList) => {
      theTagList.value = newTagList
    }
  )

  watch(
    () => props.tags,
    () => {
      getSelectTags()
    }
  )

  const collapseTagList = (event) => {
    if (!tagListContainer.value.contains(event.target)) {
      shouldShowTagList.value = false
    }
  }

  const getSelectTags = () => {
    selectedTags.value = [
      ...props.tags.task_tags.map((tag) => tag),
      ...props.tags.other_tags.map((tag) => tag)
    ]
  }

  const clickDelete = () => {
    if (delDesc.value === mcpPath.value) {
      deleteModel().catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    }
  }

  const showTagList = () => {
    if (tagInput.value !== '') {
      const userTriggerTagList = theTagList.value.filter((tag) => {
        return (
          tag.show_name.includes(tagInput.value) ||
          tag.name.includes(tagInput.value)
        )
      })

      if (userTriggerTagList.length > 0) {
        theTagList.value = userTriggerTagList
        shouldShowTagList.value = true
      }
    } else {
      shouldShowTagList.value = false
    }
  }

  const selectTag = (newTag) => {
    const findTag = selectedTags.value.find((tag) => tag.name === newTag.name)
    if (!findTag) {
      selectedTags.value.push({ name: newTag.name, zh_name: newTag.show_name })
      tagInput.value = ''
      shouldShowTagList.value = false
    }
  }

  const removeTag = (tagName) => {
    selectedTags.value = selectedTags.value.filter(
      (item) => item.name !== tagName
    )
  }

  const deleteModel = async () => {
    const mcpDeleteEndpoint = `/mcps/${props.path}`
    const { error } = await useFetchApi(mcpDeleteEndpoint).delete().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        window.location.href = document.referrer || '/mcp/servers'
      }, 1000)
      return true
    }
  }

  const changeVisibility = (value) => {
    ElMessageBox({
      title: t('mcps.edit.changeVisibility'),
      message: h('p', null, [
        h('span', null, t('all.changeVis')),
        h(
          'span',
          null,
          value === 'Private' ? t('all.private') : t('all.public')
        ),
        h(
          'span',
          null,
          value === 'Private'
            ? t('mcps.edit.privateInfo')
            : t('mcps.edit.publicInfo')
        )
      ]),
      showCancelButton: true,
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel')
    })
      .then(() => {
        changeVisibilityCall(value)
      })
      .catch(() => {
        visibilityName.value = value === 'Private' ? 'Public' : 'Private'
        ElMessage({
          type: 'warning',
          message: t('all.changeCancel')
        })
      })
  }

  const changeVisibilityCall = (value) => {
    const isprivateSelected = value === 'Private'
    const payload = { private: isprivateSelected }
    updateMcp(payload)
  }

  const updateTags = () => {
    if (selectedTags.value.length !== 0) {
      const newSelectedTags = selectedTags.value.map((tag) => tag.name)
      updateTagsInReadme(newSelectedTags)
    } else {
      ElMessage({
        message: t('mcps.edit.needMcpTag'),
        type: 'warning'
      })
    }
  }

  const fetchReadme = async () => {
    const url = `/mcps/${props.path}/blob/README.md`
    const { data } = await useFetchApi(url).json()
    if (data.value) {
      const body = data.value
      readmeContent.value = atob_utf8(body.data.content)
      readmeSha.value = body.data.sha
    }
  }

  const updateTagsInReadme = async (newTags) => {
    if (readmeContent.value) {
      const { metadata, content } = parseMD(readmeContent.value)
      const newMetadata = {
        ...metadata,
        tags: newTags
      }
      const newMetadataString = yaml.dump(newMetadata)
      const newContent = `---\n${newMetadataString}\n---\n\n${content}`
      updateReadme(newContent)
    }
  }

  const updateReadme = async (newContent) => {
    const updateReadmeEndpoint = `/mcps/${props.path}/raw/README.md`
    const bodyData = {
      content: btoa_utf8(newContent),
      message: 'Update README.md',
      branch: props.defaultBranch,
      new_branch: props.defaultBranch,
      sha: readmeSha.value
    }
    const option = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    }

    const { data, error } = await useFetchApi(updateReadmeEndpoint, option)
      .put()
      .json()

    if (data.value) {
      fetchRepoDetail()
      ElMessage({ message: t('all.updateSuccess'), type: 'success' })
    } else {
      ElMessage({ message: error.value.msg, type: 'warning' })
    }
  }

  const updateNickname = () => {
    if (!!theMcpNickname.value.trim()) {
      const payload = { nickname: theMcpNickname.value }
      updateMcp(payload)
    } else {
      ElMessage({
        message: t('mcps.edit.needMcpName'),
        type: 'warning'
      })
    }
  }

  const updateMcpDesc = () => {
    if (!!theMcpDesc.value.trim()) {
      const payload = { description: theMcpDesc.value }
      updateMcp(payload)
    } else {
      ElMessage({
        message: t('mcps.edit.needMcpDesc'),
        type: 'warning'
      })
    }
  }

  const updateMcp = async (payload) => {
    const mcpUpdateEndpoint = `/mcps/${props.path}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }

    const { error } = await useFetchApi(mcpUpdateEndpoint, options).put().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      if (payload.hasOwnProperty('private')) {
        updateVisibility(payload.private)
      }
      fetchRepoDetail()
      ElMessage({ message: 'Success', type: 'success' })
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      document
        .getElementById('confirmDelete')
        .classList.replace('bg-error-600', 'bg-error-700')
    }
  }

  const handleMouseLeave = () => {
    document
      .getElementById('confirmDelete')
      .classList.replace('bg-error-700', 'bg-error-600')
  }
</script>
