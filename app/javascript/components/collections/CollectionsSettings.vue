<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- collection name -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('collections.edit.cnName') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
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
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('collections.edit.desc') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
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
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('collections.edit.theme') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
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
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">增加项目</div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">增加更多项目到集合</div>
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
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('collections.edit.changeVisibility') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('collections.edit.statusText') }}
          <span class="text-black font-semibold"
            >【{{ visibility ? $t('all.private') : $t('all.public') }}】</span
          >
          {{ $t('collections.edit.status') }}。{{
            visibility ? $t('collections.edit.privateVis') : $t('collections.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('collections.edit.collectionVisibility') }}</p>
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

    <!-- Delete -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('collections.edit.delCollection') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('collections.edit.delTips') }}
          <span class="text-black font-medium break-words">{{
            `${collection.username}/${collection.name}`
          }}</span>
          {{ $t('collections.collection') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${collection.username}/${collection.name}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">{{ $t('collections.collectionName') }}</p>
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
            class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-[8px]"
            :class="
              delDesc === `${collection.username}/${collection.name}`
                ? 'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white'
                : 'bg-[#F2F4F7]'
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
  import { ref, computed, inject, onMounted, h } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    collection: Object,
    userName: String,
    collectionsId: String
  })
  const { t } = useI18n()

  const csghubServer = inject('csghubServer')
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

    const options = { method: 'PUT', body: JSON.stringify(transformedData) }

    const response = await jwtFetch(
      `${csghubServer}/api/v1/collections/${props.collectionsId}`,
      options
    )
    const data = await response.json()
    if (!response.ok) {
      ElMessage.warning(data.msg)
    } else {
      ElMessage.success(t('all.updateSuccess'))
      return response.json()
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      document.getElementById('confirmDelete').classList.replace('bg-[#D92D20]', 'bg-[#B42318]')
    }
  }

  const handleMouseLeave = () => {
    document.getElementById('confirmDelete').classList.replace('bg-[#B42318]', 'bg-[#D92D20]')
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
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/collections/${props.collectionsId}`, options)
    if (!res.ok) {
      ElMessage({
        message: t('all.fetchError'),
        type: 'warning'
      })
    } else {
      res.json().then((body) => {
        ElMessage({ message: t('all.delSuccess'), type: 'success' })
        setTimeout(() => {
          window.location.href = `/profile/${props.userName}`
        }, 500)
      })
    }
  }

  onMounted(() => {})
</script>
