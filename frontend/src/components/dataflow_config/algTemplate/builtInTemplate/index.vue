<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-600 text-sm font-medium">
        {{ t("dataPipelines.builtInTaskTemplate") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.builtInTaskTemplate") }}
    </p>
    <!-- <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t("dataPipelines.algorithmTemplateDescription") }}
    </p> -->
    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t("dataPipelines.searchTemplate") }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="form.searchStr"
          @keyup.enter="searchListFun"
          @clear="searchListFun"
          :placeholder="`${t('dataPipelines.toInput')}${t(
            'dataPipelines.templateName'
          )}`"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"><search /></el-icon>
          </template>
        </el-input>
        <!-- <CsgButton
          class="btn btn-primary btn-sm whitespace-nowrap"
          @click="toNewPage('add', null)"
          :name="t('dataPipelines.createTask')"
          :icon="true"
        /> -->
      </div>
    </div>

    <el-card shadow="never" class="mt-[16px]">
      <p class="text-gray-900 text-2xl font-medium">{{ t('dataPipelines.templateList') }}</p>
      <div class="mt-[12px] grid gap-x-4 gap-y-4 grid-cols-3 md:grid-cols-2">
        <el-card
          shadow="never"
          class="rounded-3xl"
          v-for="(item, index) in templateList"
          :key="index"
        >
          <template #header>
            <div class="card-header">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <p
            class="text-sm multi-line-text text-gray-400"
            :title="item.description"
          >
            {{ item.description }}
          </p>
          <template #footer>
            <div class="flex justify-between items-center text-xs">
              <div>
                {{ t(`dataPipelines.${item.type}`) }}
              </div>
              <div class="flex">
                <div
                  class="mr-[12px] hover:underline cursor-pointer"
                  @click="router.push(`/datapipelines/createTemplate?url=builtin&type=copy&templateId=${item.id}`)"
                >
                  {{ t('dataPipelines.copy') }}
                </div>
                <div
                  class="text-brand-600 hover:underline cursor-pointer"
                  @click="router.push('/datapipelines/addDataProcessing?url=builtin&templateId=' + item.id)"
                >
                  {{ t('dataPipelines.use') }}
                </div>
              </div>
            </div>
          </template>
        </el-card>
      </div>

      <!-- 无数据 -->
      <el-empty
        v-if="templateList.length == 0"
        description="暂无内置模板"
        :image-size="100"
        />
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../../packs/useFetchApi";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const form = ref({
  searchStr: "",
});
const templateList = ref([]);

const toNewPage = (type, index) => {
  router.push({ path: "/datapipelines/newTemplate", query: { type, index } });
};
const goToNewTask = (index) => {
  router.push(`/datapipelines/newTask?type=ops&templateId=${index}`);
};

const router = useRouter();

const searchForm = ref({
  page: 1,
  per: 100,
  buildin: true // true 内置
})

// buildin
const getTemplatesListFun = async () => {
  const params = new URLSearchParams()
  params.append('page', searchForm.value.page)
  params.append('per', searchForm.value.per)
  params.append('buildin', searchForm.value.buildin)
  const url = `/dataflow/algo_templates?${params.toString()}`

  const { data } = await useFetchApi(url).get().json();
  console.log('data=', data.value.templates)
  if (data.value) {
    const res = data.value.data.templates;
    templateList.value = res;
  }
  // searchListFun();
};
const searchListFun = async () => {
  templateList.value = templateList.value.filter((item) =>
    item.name.includes(form.value.searchStr)
  );
};
const handleDelete = async (id) => {
  const url = `/dataflow/templates/${id}`;

  const { data, error } = await useFetchApi(url).delete().json();

  if (error.value) {
    ElMessage({
      message: `操作失败: ${error.value.msg}`,
      type: "error",
    });
  } else {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getTemplatesListFun();
  }
};

onMounted(() => {
  getTemplatesListFun();
});
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

.multi-line-text {
  display: -webkit-box; /* 兼容WebKit内核浏览器 */
  -webkit-line-clamp: 2; /* 显示最大3行 */
  -webkit-box-orient: vertical; /* 设置垂直方向上的排列方式 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
  min-height: 45px;
  max-height: 45px;
}
</style>
