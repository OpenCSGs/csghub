<template>
  <div class="text-left h-full p-[32px] overflow-auto bg-[#FFF]">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-[20px] h-[20px]" name="homeIcon" />
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[#344054] text-[14px] font-medium">数据处理</p>
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[#344054] text-[14px] font-medium">新建任务</p>
    </div>
    <p class="text-[#101828] text-[30px] font-medium">新建任务</p>
    <p class="text-[#475467] text-[16px] font-light mt-[2px]">
      数据处理可支持用户使用不同的模型算子，针对大模型所用的数据进行处理，包括数据清洗、自动数据增强及分析等处理方式，用户可通过数据处理来获取更高质量的数据
    </p>
    <div class="mainOption mt-[32px] flex items-center justify-between">
      <el-form :model="form" label-width="auto" label-position="top">
        <el-form-item label="任务名称">
          <el-input style="width: 640px" v-model="form.git_server_url" />
        </el-form-item>
        <el-form-item label="数据来源">
          <el-select v-model="form.private_token" class="w-[640px]" :placeholder="t('common.select')">
            <el-option :label="t('pages.option1')" value="strict" />
            <el-option :label="t('pages.option2')" value="moderate" />
            <el-option :label="t('pages.option3')" value="lenient" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源分支">
          <el-select v-model="form.private_token" class="w-[640px]" :placeholder="t('common.select')">
            <el-option :label="t('pages.option1')" value="strict" />
            <el-option :label="t('pages.option2')" value="moderate" />
            <el-option :label="t('pages.option3')" value="lenient" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据流向">
          <el-select v-model="form.private_token" class="w-[640px]" :placeholder="t('common.select')">
            <el-option :label="t('pages.option1')" value="strict" />
            <el-option :label="t('pages.option2')" value="moderate" />
            <el-option :label="t('pages.option3')" value="lenient" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据流向分支">
          <el-input style="width: 640px" v-model="form.git_server_url" />
        </el-form-item>
        <el-form-item label="任务模版">
          <el-select v-model="form.private_token" class="w-[640px]" placeholder="t('common.select')">
            <el-option label="1" value="strict" />
            <el-option label="2" value="moderate" />
            <el-option label="3" value="lenient" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="borderBox mt-[2px]">
      <div class="py-[20px] px-[24px] flex items-center justify-between">
        <p class="text-[18px] text-[#101828] font-medium">预置算子选择</p>
        <el-button type="primary" @click="goToNewTask">发布为新模板</el-button>
      </div>
      <div class="flex flex-col">
        <!-- <draggable v-model="tableData" item-key="id" @end="onEnd" :animation="200" tag="tbody">
          <template #item="{ element }">
            <el-table
          :data="[element]"
          class="rounded tableCont"
          :empty-text="t('common.noData')"
          header-cell-class-name="tableHeader"
        >
          <el-table-column prop="project_name" :label="t('pages.tableHeader1')" />
          <el-table-column prop="repo_status_display_name" :label="t('pages.tableHeader2')" />
          <el-table-column prop="token" :label="t('pages.tableHeader3')" width="150">
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-end">
                <el-popconfirm
                  :title="`${t('common.ensure')}${t('common.delete')}?`"
                  :confirm-button-text="t('common.delete')"
                  :cancel-button-text="t('common.cancel')"
                  @confirm="handleDelete(scope.row)"
                >
                  <template #reference>
                    <el-button type="text" class="flex items-center justify-start cursor-pointer">{{ t('common.delete') }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                >
                详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
          
    </draggable> -->

        <el-table
          :data="tableData"
          class="rounded tableCont"
          empty-text="暂无数据"
          header-cell-class-name="tableHeader"
          @row-drag-end="onRowDragEnd"
        >
          <el-table-column width="120" label="执行顺序">
            <template #default="{ $index }">
              <div class="flex items-center justify-start gap-[10px]">
                <span>{{ $index + 1 }}</span>
                <div class="drag-handle" @mousedown.stop="">
                  <SvgIcon class="w-[16px] h-[16px]" name="drag" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="是否开启" width="150">
            <template #default="scope">
              <el-switch v-model="scope.row.isOpen" style="--el-switch-on-color: #3250bd" />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="算子类型" />
          <el-table-column label="算子配置">
            <template #default="scope">
              <div v-if="scope.row.params.length > 0">
                <div v-for="(item, index) in scope.row.params" :key="index" class="flex flex-col gap-[12px] typeItemCont">
                  <el-slider
                    v-if="item.type == 'PositiveFloat'"
                    v-model="scope.row.params.value"
                    :min="scope.row.params[0].value"
                    range
                    :max="scope.row.params[1].value"
                  />
                  <el-select
                    v-if="item.type == 'STRING'"
                    v-model="item.value"
                    class="w-full"
                    :placeholder="t('common.select')"
                  >
                    <el-option
                      v-for="selItem in item.option_values"
                      :key="selItem.key"
                      :label="selItem.label"
                      :value="selItem.key"
                    />
                  </el-select>
                  <el-input v-if="item.type=='FLOAT'" type="number" step="0.01" style="width: 100%" v-model="item.value" />
                  <el-checkbox v-if="item.type=='BOOLEAN'" v-model="item.value" :label="item.name" size="small" class="block" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column label="效果预览">
              <template #default="scope">
                <p class="text-[#101828] text-[14px] line-through">{{ scope.row.samples?.before }}</p>
                <p class="text-[#101828] text-[14px]">{{ scope.row.samples?.after }}</p>
              </template>
            </el-table-column>
        </el-table>
        <!-- <el-table
      :data="sortedData"
      border
      style="width: 100%"
      @row-drag-end="onRowDragEnd"
    >
      <el-table-column prop="name" label="名称" width="180">
        <template #default="scope">
          <div class="drag-handle" @mousedown.stop="">
            &#8597;
          </div>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="180"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="removeRow(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
      </div>
    </div>
    <div class="flex items-center justify-end gap-[14px] pt-[20px] bottomBtnGroup">
      <el-button>取消</el-button>
      <el-button type="primary">创建完成</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import Sortable from 'sortablejs';

import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

const testData = {
  chinese_convert_mapper: {
    name: 'Chinese Converter',
    description: '用于在繁体中文、简体中文和日文汉字之间进行转换。',
    type: 'Mapper',
    group: '',
    samples: {
      before: '这是几个简体字，会被转换为繁体字',
      after: '這是幾個簡體字，會被轉換爲繁體字',
    },
    params: [
      {
        name: '转换模式',
        type: 'STRING',
        option_values: [
          {
            key: 's2t',
            label: '简体转繁体',
          },
          {
            key: 't2s',
            label: '繁体转简体',
          },
          {
            key: 's2tw',
            label: '简体转台湾正体',
          },
          {
            key: 'tw2s',
            label: '台湾正体转简体',
          },
          {
            key: 's2hk',
            label: '简体转香港繁体',
          },
          {
            key: 'hk2s',
            label: '香港繁体转简体',
          },
          {
            key: 's2twp',
            label: '简体转台湾正体（带标点符号）',
          },
          {
            key: 'tw2sp',
            label: '台湾正体转简体（带标点符号）',
          },
          {
            key: 't2tw',
            label: '繁体转台湾正体',
          },
          {
            key: 'tw2t',
            label: '台湾正体转繁体',
          },
          {
            key: 'hk2t',
            label: '香港繁体转繁体',
          },
          {
            key: 't2hk',
            label: '繁体转香港繁体',
          },
          {
            key: 't2jp',
            label: '繁体转日文汉字',
          },
          {
            key: 'jp2t',
            label: '日文汉字转繁体',
          },
        ],
        value: 't2s',
      },
    ],
  },
  clean_copyright_mapper: {
    name: 'Copyright Cleaner',
    description: '用于删除文本样本开头的版权声明。',
    type: 'Mapper',
    group: '',
    samples: {
      before: '这是一段 /* 多行注释\n注释内容copyright\n*/ 的文本。另外还有一些 // 单行注释。',
      after: '这是一段  的文本。另外还有一些 // 单行注释。',
    },
    params: [],
  },
  clean_email_mapper: {
    name: 'Email Cleaner',
    description: '用于删除文本样本中的电子邮件地址。',
    type: 'Mapper',
    group: '',
    samples: {
      before: 'happy day euqdh@cjqi.com',
      after: 'happy day ',
    },
    params: [],
  },
  nlpcda_zh_mapper: {
    name: 'Chinese Augment',
    description: '使用nlpcda库对中文文本进行简单增强。',
    type: 'Mapper',
    group: '',
    samples: {
      before: '这里一共有5种不同的数据增强方法',
      after: '这里一共有伍种不同的数据增强方法',
    },
    params: [
      {
        name: '替换相似单词',
        type: 'BOOLEAN',
        option_values: null,
        value: false,
      },
      {
        name: '随机交换单词位置',
        type: 'BOOLEAN',
        option_values: null,
        value: false,
      },
      {
        name: '随机删除字符',
        type: 'BOOLEAN',
        option_values: null,
        value: false,
      },
      {
        name: '随机交换字符位置',
        type: 'BOOLEAN',
        option_values: null,
        value: false,
      },
      {
        name: '替换等效数字',
        type: 'BOOLEAN',
        option_values: null,
        value: false,
      },
    ],
  },
  generate_instruction_mapper: {
    name: 'Instruction Generator',
    description: '用于生成新的指令文本数据。\n    ',
    type: 'Mapper',
    group: '',
    samples: {
      before: '',
      after:
        '{"messages":[{"content":"You are a helpful assistant","role":"system"},{"content":"哪种文学流派强调通过象征和暗喻探索潜意识思维?","role":"user"},{"content":"现代主义文学流派强调通过象征、暗喻以及非线性叙述等手法，深入探索人物的内心世界与潜意识思维。","role":"assistant"}]}',
    },
    params: [
      {
        name: '模型名称',
        type: 'STRING',
        option_values: [
          {
            key: 'Qwen/Qwen-7B-Chat',
            label: 'Qwen/Qwen-7B-Chat',
          },
        ],
        value: 'Qwen/Qwen-7B-Chat',
      },
      {
        name: '相似度阈值',
        type: 'FLOAT',
        option_values: null,
        value: 0.7,
      },
    ],
  },
};
const ifOpen = ref(true);
const form = ref({
  git_server_url: '',
  private_token: '',
});
const tableData = ref([]);

const router = useRouter();

const onEnd = (evt) => {
  console.log('Dragging ended', evt);
  // 这里可以执行一些额外的操作，比如保存排序后的数据
};
const sortedData = ref([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
]);
const onRowDragEnd = (event) => {
  const movedItem = tableData.value.splice(event.oldIndex, 1)[0];
  tableData.value.splice(event.newIndex, 0, movedItem);
};

const extractValues = (data) => {
  const result = [];

  // 遍历每个映射器
  for (const key in data) {
    const mapper = data[key];
    result.push({
      key: key,
      isOpen:true,
      ...data[key],
    });
  }

  return result;
};

onMounted(() => {
  tableData.value = extractValues(testData);
  const tableBody = document.querySelector('.el-table__body-wrapper tbody');

  Sortable.create(tableBody, {
    animation: 150,
    handle: '.drag-handle', // 拖拽手柄
    onEnd: onRowDragEnd,
  });
});

onBeforeUnmount(() => {});

// onMounted(() => {
//   console.log('数据处理')
// });
</script>
<style lang="scss" scoped>
.hoverChange {
  &:hover {
    border: 1px solid var(--Gray-300, #d0d5dd);
    background: var(--Gray-50, #f9fafb);
    color: #3250bd;
  }
  &:active {
    border: 1px solid var(--Gray-300, #d0d5dd);
    background: var(--Base-White, #fff);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(152, 162, 179, 0.14);
    color: #3250bd;
  }
  &.delBtn {
    &:hover,
    &:active {
      color: #f87171;
    }
  }
}
:deep(.settingsTableBtn) {
  .el-button {
    padding: 0 !important;
    margin-left: 20px !important;
    font-size: 14px !important;
    color: #667085 !important;
    font-weight: 400 !important;
    &:hover {
      color: #3250bd !important;
    }
  }
}

// :deep(.el-form-item__label){
//   font-size: 14px;
//   color: #344054;
//   font-weight: 400;
// }
:deep(.tableCont) {
  .el-button--text {
    background: transparent !important;
  }
}

:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 12px;
  }
}
.dataItemCont {
  border-radius: var(--spacing-lg, 12px);
  border: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
}
.borderBox {
  border-radius: var(--spacing-lg, 12px);
  border: var(--spacing-none, 1px) solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  overflow: hidden;
}
:deep(.el-table__header) {
  background: var(--Gray-50, #f9fafb);
}
:deep(.el-table) {
  .el-table__cell {
    padding: 16px 24px;
  }
}
:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #475467;
    font-weight: 300;
  }
}
:deep(.tableHeader) {
  font-size: 12px !important;
  font-weight: normal !important;
  color: #475467;
  padding: 12px 24px !important;
  border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Gray-50, #f9fafb) !important;
}

.drag-handle {
  cursor: move; /* 拖拽句柄效果 */
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #888;
  margin-right: 10px;
}
.typeItemCont > * { /* 选择直接子元素 */
  margin-bottom: 12px;
}

.typeItemCont > *:last-child { /* 选择最后一个直接子元素 */
  margin-bottom: 0;
}
</style>
