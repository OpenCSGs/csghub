<template>
  <div
    class="border border-gray-200 rounded-md my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- collection name -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('collections.edit.cnName') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('collections.edit.cnNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="collectionNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <el-button
          @click="updateCollection()"
          class="w-[100px]"
          >{{ $t('all.update') }}</el-button
        >
      </div>
    </div>
    <el-divider />

    <!-- collection desc -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('collections.edit.desc') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('collections.edit.descTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="collectionDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <el-button
          @click="updateCollection()"
          class="w-[100px]"
          >{{ $t('all.update') }}</el-button
        >
      </div>
    </div>
    <el-divider />

    <!-- theme -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('collections.edit.theme') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('collections.edit.upDateTheme') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-select
          v-model="themeColor"
          :placeholder="$t('all.select')"
          @change="updateCollection()"
          size="large"
          class="!w-[512px] sm:!w-full"
        >
          <el-option
            v-for="item in colorNameList"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]"
          />
        </el-select>
      </div>
    </div>
    <el-divider />

    <!-- add project -->
    <!-- <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">增加项目</div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">增加更多项目到集合</div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-select
          v-model="themeColor"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled
        >
          <el-option
            v-for="item in colorNameList"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]"
          />
        </el-select>
      </div>
    </div>
    <el-divider /> -->

    <!-- Change Visibility -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('collections.edit.changeVisibility') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('collections.edit.statusText') }}
          <span class="text-black font-semibold"
            >[{{ visibility ? $t('all.private') : $t('all.public') }}]</span
          >
          {{ $t('collections.edit.status') }} {{
            visibility ? $t('collections.edit.privateVis') : $t('collections.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">{{ $t('collections.edit.collectionVisibility') }}</p>
        <el-select
          v-model="visibility"
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

    <!-- 删除应用空间 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('collections.edit.delCollection') }}
        </div>

        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('collections.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('collections.edit.canNot') }}</span>
          {{ $t('collections.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('collections.edit.delTips3') }}
        </div>

        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${collection.username}/${collection.name}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-gray-700 text-sm">{{ $t('collections.collectionName') }}</p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-gray-400 py-[8px] px-[12px] text-sm leading-[20px] rounded-md"
            :class="
              delDesc === `${collection.username}/${collection.name}`
                ? 'bg-error-600 text-white cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-error-600 hover:text-white'
                : 'bg-gray-100'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
          >
            {{ $t('endpoints.settings.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, h } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import useUserStore from '../../stores/UserStore'

  const userStore = useUserStore()

  const props = defineProps({
    collection: Object,
    userName: String,
    collectionsId: String
  })
  const { t } = useI18n()

  const delDesc = ref('')
  const collectionName = ref(props.collection.name)
  const collectionNickname = ref(props.collection.nickname)
  const collectionDesc = ref(props.collection.description)
  const visibility = ref(props.collection.private)
  const options = ref([
    { value: true, label: t('all.private') },
    { value: false, label: t('all.public') }
  ])
  const themeColor = ref(props.collection.theme)

  const colorNameList = ref([
    ['#F5F3FF', t('collections.color.lPurple')],
    ['#ECFDF3', t('collections.color.lGreen')],
    ['#FFF4ED', t('collections.color.lOrange')]
  ])

  const changeVisibility = (value) => {
    ElMessageBox({
      title: t('collections.edit.changeVisibility'),
      message: h('p', null, [
        h('span', null, t('all.changeVis')),
        h('span', null, value ? t('all.private') : t('all.public')),
        h(
          'span',
          null,
          value ? t('collections.edit.privateInfo') : t('collections.edit.publicInfo')
        )
      ]),
      showCancelButton: true,
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel')
    })
      .then(() => {
        updateCollection(value)
      })
      .catch(() => {
        ElMessage({
          type: 'warning',
          message: t('all.changeCancel')
        })
      })
  }

  async function updateCollection(value) {
    const transformedData = {
      description: collectionDesc.value,
      name: collectionName.value,
      nickname: collectionNickname.value,
      private: value ? value : visibility.value,
      theme: themeColor.value
    }

    const options = { body: JSON.stringify(transformedData) }

    const { data, error } = await useFetchApi(
      `/collections/${props.collectionsId}`,
      options
    ).put().json()

    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      ElMessage.success(t('all.updateSuccess'))
      return data.value
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      document.getElementById('confirmDelete').classList.replace('bg-error-600', 'bg-error-700')
    }
  }

  const handleMouseLeave = () => {
    document.getElementById('confirmDelete').classList.replace('bg-error-700', 'bg-error-600')
  }

  const clickDelete = () => {
    if (delDesc.value === `${props.collection.username}/${props.collection.name}`) {
      deleteCollection().catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    }
  }

  const deleteCollection = async () => {
    const options = {
      headers: { 'Content-Type': 'application/json' }
    }
    const { error } = await useFetchApi(`/collections/${props.collectionsId}`, options).delete().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        // userStore will be initialized when loading navbar
        // delete will trigger manually, so we don't need to check if userStore initialized or not
        window.location.href = `/profile/${userStore.username}`
      }, 500)
    }
  }

  onMounted(() => {})
</script>
