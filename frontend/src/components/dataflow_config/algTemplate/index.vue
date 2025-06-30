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
      <p class="text-brand-600 text-sm font-medium">
        {{ t('dataPipelines.algorithmTemplate') }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t('dataPipelines.algorithmTemplate') }}
    </p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t('dataPipelines.algorithmTemplateDescription') }}
    </p>
    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t('dataPipelines.searchTaskTemplate') }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="form.searchStr"
          @keyup.enter="searchListFun"
          @clear="searchListFun"
          :placeholder="`${t('dataPipelines.toInput')}${t(
            'dataPipelines.taskName'
          )}`"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"
              ><search
            /></el-icon>
          </template>
        </el-input>
        <CsgButton
          class="btn btn-primary btn-sm whitespace-nowrap"
          @click="toNewPage('add', null)"
          :name="t('dataPipelines.createTemplate')"
          :icon="true"
        />
      </div>
    </div>
    <div
      class="grid grid-cols-3 md:grid-cols-2 xs:grid-cols-1 items-start justify-between mt-6 gap-5"
    >
      <div
        class="dataItemCont p-3 duration-200 ease-in-out"
        v-for="(item, index) in templateList"
        :key="index"
      >
        <div class="flex items-center justify-start gap-2 mb-2">
          <p class="text-gray-700 text-md font-medium line-clamp-1">{{ item.name }}</p>
        </div>
        <div class="relative">
          <el-tooltip
            class="tooltip"
            effect="dark"
            :content="item.description"
            placement="top"
            popper-class="tool-tip-custom"
            :show-after="100"
            :enterable="false"
          >
            <template #content>
              <div style="max-width: 300px; white-space: normal;">
                {{ item.description }}
              </div>
            </template>
            <p class="text-gray-600 text-sm font-light overflow-hidden line-clamp-2 tooltip">
              {{ item.description }}
            </p>
          </el-tooltip>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-gray-700 text-sm font-normal">{{
            item.type ? t(`dataPipelines.${item.type}`) : '-'
          }}</span>
          <div class="flex items-center justify-end gap-1">
            <CsgButton
              class="btn btn-link-gray btn-md whitespace-nowrap"
              @click="toNewPage('add', index)"
              :name="t('dataPipelines.create')"
            />
            <CsgButton
              v-if="!item.buildin"
              class="btn btn-link-gray btn-md whitespace-nowrap"
              @click="toNewPage('edit', index)"
              :name="t('dataPipelines.edit')"
            />
            <CsgButton
              class="btn btn-link-color btn-md whitespace-nowrap"
              @click="goToNewTask(index)"
              :name="t('dataPipelines.apply')"
            />
            <el-popconfirm
              :title="`${t('dataPipelines.deleteConfirm')}?`"
              :confirm-button-text="t('dataPipelines.confirm')"
              :cancel-button-text="t('dataPipelines.cancel')"
              width="220px"
              @confirm="handleDelete(item.template_id)"
            >
              <template #reference>
                <CsgButton
                  v-if="item.template_id"
                  class="btn btn-link-gray btn-sm whitespace-nowrap"
                  :name="t('dataPipelines.remove')"
                />
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const form = ref({
    searchStr: ''
  })
  const templateList = ref([])
  const templateListAll = ref([])

  const toNewPage = (type, index) => {
    router.push({ path: '/datapipelines/newTemplate', query: { type, index } })
  }
  const goToNewTask = (index) => {
    router.push(`/datapipelines/newTask?type=ops&templateId=${index}`)
  }

  const router = useRouter()

  const getTemplatesListFun = async () => {
    const url = '/dataflow/templates'

    const { data } = await useFetchApi(url).get().json()

    if (data.value) {
      const res = data.value
      templateListAll.value = res
    }
    searchListFun()
  }
  const searchListFun = async () => {
    templateList.value = templateListAll.value.filter((item) =>
      item.name.includes(form.value.searchStr)
    )
  }
  const handleDelete = async (id) => {
    const url = `/dataflow/templates/${id}`

    const { data, error } = await useFetchApi(url).delete().json()

    if (error.value) {
      ElMessage({
        message: `操作失败: ${error.value.msg}`,
        type: 'error'
      })
    } else {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      getTemplatesListFun()
    }
  }

  onMounted(() => {
    getTemplatesListFun()
  })
</script>
<style lang="less" scoped>
  :deep(.el-form--inline) {
    .el-form-item {
      margin-right: 12px;
    }
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
  :global(.el-popper.tool-tip-custom) {
    max-width: 300px !important;
    white-space: pre-line !important;
    word-break: break-word;
    line-height: 1.5;
    padding: 8px 12px;
  }
</style>
