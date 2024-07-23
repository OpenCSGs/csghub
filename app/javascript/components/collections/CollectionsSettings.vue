<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- 合集中文名称 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">合集中文名称</div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          将会显示在模型列表页面中，选填
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

    <!-- 合集介绍 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">合集介绍</div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          一段关于合集的介绍，选填
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

    <!-- 主题 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">主题</div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          更新主题
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetune.detail.settings.regionTip3') }}
        </p>
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

    <!-- 增加项目 -->
    <!-- 改为先选类型再选 -->
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

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">修改合集可见性</div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          当前合集目前是
          <span class="text-black font-semibold"
            >【{{ visibility ? $t('all.private') : $t('all.public') }}】</span
          >
          状态。{{ visibility ? '只有创建者或组织成员可见' : '任何人都可以看到此合集' }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('models.edit.modelVisibility') }}</p>
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

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">删除合集</div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          此操作无法撤销.这将永久删除
          <span class="text-black font-medium break-words">{{
            `${collection.username}/${collection.name}`
          }}</span>
          合集
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
        <p class="text-[#344054] text-[14px]">模型名称</p>
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
    ['#F5F3FF', '淡紫色'],
    ['#ECFDF3', '淡绿色'],
    ['#FFF4ED', '淡橙色']
  ])

  const changeVisibility = (value) => {
    console.log(value)
    ElMessageBox({
      title: '修改合集可见性',
      message: h('p', null, [
        h('span', null, t('all.changeVis')),
        h('span', null, value ? t('all.private') : t('all.public')),
        h('span', null, value ? t('models.edit.privateInfo') : t('models.edit.publicInfo'))
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
    console.log(value);
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
      ElMessage.success('更新成功')
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
