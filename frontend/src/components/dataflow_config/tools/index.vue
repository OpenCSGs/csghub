<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon
        class="w-5 h-5"
        name="dataflow_homeIcon"
      />
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p class="text-brand-700 text-sm font-medium">
        {{ t('dataPipelines.toolsTit') }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t('dataPipelines.toolsTit') }}
    </p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t('dataPipelines.toolsDec') }}
    </p>
    <el-tabs
      v-model="activeName"
      class="mt-6"
      @tab-change="searchListFun"
    >
      <el-tab-pane
        :label="t('dataPipelines.toolsTab1')"
        name="Internal"
      >
        <div
          class="mainOption mt-8 mb-1 flex items-center justify-start gap-4 xs:flex-wrap"
        >
          <div class="w-[350px] xs:w-full">
            <p class="text-gray-700 text-sm mb-1.5">
              {{ t('dataPipelines.toolsSearch') }}
            </p>
            <el-input
              style="width: 100%"
              v-model="form.searchStr"
              @keyup.enter="searchListFun"
              @clear="searchListFun"
              :placeholder="`${t('dataPipelines.toInput')}${t(
                'dataPipelines.toolsName'
              )}`"
              clearable
              ><template #prefix>
                <el-icon class="el-input__icon w-5 h-5">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>

          <div class="w-[350px] xs:w-full">
            <p class="text-gray-700 text-sm mb-1.5">
              {{ t('dataPipelines.toolsType') }}
            </p>
            <el-select
              v-model="form.sub_type"
              style="width: 100%"
              clearable
              :placeholder="t('dataPipelines.toSel')"
              @change="searchListFun"
            >
              <el-option
                label="Preprocess"
                value="Preprocess"
              />
              <el-option
                label="Postprocess"
                value="Postprocess"
              />
              <el-option
                label="Common"
                value="Common"
              />
            </el-select>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="false"
        :label="t('dataPipelines.toolsTab2')"
        name="External"
      >
        <div
          class="mainOption mt-8 flex items-center justify-start gap-4 xs:flex-wrap"
        >
          <div class="w-[350px] xs:w-full">
            <p class="text-gray-700 text-sm mb-1.5">
              {{ t('dataPipelines.toolsSearch') }}
            </p>
            <el-input
              style="width: 100%"
              v-model="form2.searchStr"
              @keyup.enter="searchListFun"
              @clear="searchListFun"
              :placeholder="`${t('dataPipelines.toInput')}${t(
                'dataPipelines.toolsName'
              )}`"
              clearable
              ><template #prefix>
                <el-icon class="el-input__icon w-5 h-5">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>

          <div class="w-[350px] xs:w-full">
            <p class="text-gray-700 text-sm mb-1.5">
              {{ t('dataPipelines.toolsType') }}
            </p>
            <el-select
              v-model="form2.sub_type"
              style="width: 100%"
              clearable
              :placeholder="t('dataPipelines.toSel')"
              @change="searchListFun"
            >
              <el-option
                label="Preprocess"
                value="Preprocess"
              />
              <el-option
                label="Postprocess"
                value="Postprocess"
              />
              <el-option
                label="Common"
                value="Common"
              />
            </el-select>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div
      class="grid grid-cols-3 md:grid-cols-2 xs:grid-cols-1 items-start justify-between mt-6 gap-5"
    >
      <div
        class="dataItemCont p-3 duration-200 ease-in-out"
        v-for="(item, index) in toolList"
        :key="index"
      >
        <div class="flex items-center justify-start gap-2 mb-2">
          <p class="text-gray-700 text-md font-medium line-clamp-1">
            {{ t(`dataPipelines.${item.name}`) }}
          </p>
        </div>
        <div class="relative">
          <el-tooltip
            class="tooltip"
            effect="dark"
            :content="t(`dataPipelines.${item.name}_dec`)"
            placement="top"
            popper-class="tool-tip-custom"
            :show-after="100"
            :enterable="false"
          >
            <template #content>
              <div style="max-width: 300px; white-space: normal;">
                {{ t(`dataPipelines.${item.name}_dec`) }}
              </div>
            </template>
            <p
              class="text-gray-600 text-sm font-light overflow-hidden line-clamp-2 tooltip"
            >
              {{ t(`dataPipelines.${item.name}_dec`) }}
            </p>
          </el-tooltip>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-gray-600 text-sm font-normal">{{
            item.sub_type
          }}</span>
          <CsgButton
            class="btn btn-link-color btn-md whitespace-nowrap"
            @click="goToNewTask(item.name)"
            :name="t('dataPipelines.create')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const activeName = ref('Internal')
  const form = ref({
    searchStr: '',
    sub_type: ''
  })
  const form2 = ref({
    searchStr: '',
    sub_type: ''
  })
  const toolList = ref([])
  const toolListAll = ref([])
  const goToNewTask = (name) => {
    router.push(`/datapipelines/newTask?type=tool&selToolName=${name}`)
  }
  const router = useRouter()
  const getToolsListFun = async () => {
    const url = '/dataflow/tools'
    try {
      const { data } = await useFetchApi(url).get().json()
      if (data.value) {
        const res = data.value
        let list = Object.values(res)
        toolListAll.value = list
      }
      searchListFun()
    } catch (error) {
      console.error(error)
    }
  }
  const searchListFun = () => {
    let searchStr =
      activeName.value === 'Internal'
        ? form.value.searchStr
        : form2.value.searchStr
    let sub_type =
      activeName.value === 'Internal'
        ? form.value.sub_type
        : form2.value.sub_type
    toolList.value = toolListAll.value.filter(
      (item) =>
        item.type === activeName.value &&
        item.name.includes(searchStr) &&
        (sub_type ? item.sub_type === sub_type : true)
    )
  }
  onMounted(() => {
    getToolsListFun()
  })
</script>

<style lang="less" scoped>
  :deep(.el-form--inline) {
    .el-form-item {
      margin-right: 12px;
    }
  }

  :global(.el-popper.tool-tip-custom) {
    max-width: 300px !important;
    white-space: pre-line !important;
    word-break: break-word;
    line-height: 1.5;
    padding: 8px 12px;
  }

  .dataItemCont {
    cursor: pointer;
    border-radius: var(--spacing-lg, 12px);
    border: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Base-White, #fff);

    .hoverBtmCont {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    }

    .btmCont {
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    &:hover {
      box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1),
        0px 2px 4px -2px rgba(16, 24, 40, 0.06);

      .hoverBtmCont {
        max-height: 200px;
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      .btmCont {
        opacity: 0;
      }
    }
  }
</style>
