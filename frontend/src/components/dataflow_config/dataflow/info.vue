<template>
  <div class="text-left h-full p-[32px] overflow-auto bg-[#FFF]">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-[20px] h-[20px]" name="homeIcon" />
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[#344054] text-[14px] font-medium">数据处理</p>
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[rgb(52,64,84)] text-[14px] font-medium">处理结果</p>
    </div>
    <div class="flex items-center justify-start gap-[4px]">
      <SvgIcon class="w-[24px] h-[24px]" name="backIcon" />
      <p class="text-[#101828] text-[30px] font-medium">处理结果</p>
    </div>
    <div class="mainOption mt-[24px] grid grid-cols-4 items-start justify-between gap-[56px]">
      <div>
        <div class="flex items-center justify-start gap-[8px] mb-[16px]">
          <p class="text-[#344054] text-[14px] font-medium">任务名称：</p>
          <p class="text-[#475467] text-[14px] font-light">新建任务-20240903tXp</p>
        </div>
        <div class="flex items-center justify-start gap-[8px]">
          <p class="text-[#344054] text-[14px] font-medium">创建时间：</p>
          <p class="text-[#475467] text-[14px] font-light">2024-09-04 11:21:25</p>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-[8px] mb-[16px]">
          <p class="text-[#344054] text-[14px] font-medium">数据量：</p>
          <p class="text-[#475467] text-[14px] font-light">55</p>
        </div>
        <div class="flex items-center justify-start gap-[8px]">
          <p class="text-[#344054] text-[14px] font-medium">完成时间：</p>
          <p class="text-[#475467] text-[14px] font-light">2024-09-04 11:23:24</p>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-[8px] mb-[16px]">
          <p class="text-[#344054] text-[14px] font-medium">数据来源：</p>
          <p class="text-[#475467] text-[14px] font-light">测试数据集>V1</p>
        </div>
        <div class="flex items-center justify-start gap-[8px]">
          <p class="text-[#344054] text-[14px] font-medium">已处理数据量：</p>
          <p class="text-[#475467] text-[14px] font-light">55</p>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-[8px] mb-[16px]">
          <p class="text-[#344054] text-[14px] font-medium">数据流向：</p>
          <p class="text-[#475467] text-[14px] font-light">测试数据集>V4</p>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="处理详情" name="1">
        <div class="borderBox">
          <el-table
            :data="tableData"
            class="rounded tableCont"
            :empty-text="t('common.noData')"
            header-cell-class-name="tableHeader"
          >
            <el-table-column type="index" width="120" label="执行顺序" />
            <el-table-column prop="type" label="算子类型" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="算子配置">
              <template #default="scope">
                <div v-if="scope.row.params.length > 0">
                  <div
                    v-for="(item, index) in scope.row.params"
                    :key="index"
                    class="flex flex-col gap-[12px] typeItemCont"
                  >
                    <el-slider
                      v-if="item.type == 'PositiveFloat'"
                      disabled
                      v-model="scope.row.params.value"
                      :min="scope.row.params[0].value"
                      range
                      :max="scope.row.params[1].value"
                    />
                    <el-select
                      v-if="item.type == 'STRING'"
                      disabled
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
                    <el-input
                      disabled
                      v-if="item.type == 'FLOAT'"
                      type="number"
                      step="0.01"
                      style="width: 100%"
                      v-model="item.value"
                    />
                    <el-checkbox
                      disabled
                      v-if="item.type == 'BOOLEAN'"
                      v-model="item.value"
                      :label="item.name"
                      size="small"
                      class="block"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="运行状态">
              <template #default="scope">
                <div class="statusBox flex items-center gap-1 px-[8px] py-[2px] statusBox1">
                  <SvgIcon name="check" class="w-[16px] h-[16px]" />
                  <span class="text-[12px]">已完成</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="已处理数据">55条</el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Session处理结果" name="2">
        <div class="borderBox">
          <el-table
            :data="sessionData"
            class="rounded tableCont"
            :empty-text="t('common.noData')"
            header-cell-class-name="tableHeader"
          >
            <el-table-column type="index" width="100" label="序号" />
            <el-table-column prop="old" label="处理前Session" />
            <el-table-column prop="type" label="处理方式" />
            <el-table-column prop="new" label="处理后Session" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务日志" name="3">
        <div class="flex items-center justify-between mb-[16px]">
          <p class="text-[#101828] font-medium text-[18px]">日志名称</p>
          <div class="optionBtn">下载日志</div>
        </div>
        <div class="resultBox">
          <pre class="text-[#F9FAFB] text-[16px] font-medium">
[2024-09-02 15:00:00] INFO: 开始数据处理流程。
[2024-09-02 15:00:01] INFO: 从文件 '/mnt/data/2602_AfRpJr42Z_2451549504.json' 加载数据。
[2024-09-02 15:00:02] INFO: 成功加载 1000 条记录。
[2024-09-02 15:00:03] WARNING: 发现 50 条记录的 'text' 字段为空，正在进行清洗。
[2024-09-02 15:00:04] INFO: 清洗完成，共清理了 50 条记录。
[2024-09-02 15:00:05] INFO: 开始转换数据为 JSONL 格式。
[2024-09-02 15:00:06] INFO: 成功将数据保存到 '/mnt/data/2602_AfRpJr42Z_2451549504.jsonl'。
[2024-09-02 15:00:07] INFO: 数据处理流程完成，处理时间为 7 秒。
          </pre>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
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

const activeTab = ref('1');
const form = ref({
  git_server_url: '',
  private_token: '',
});
const tableData = ref([]);
const sessionData = ref([
  {
    old: '[{"content":"You are a helpful assistant","role":"system"},{"content":"谁在文艺复兴时期绘制人体?","role":"user"},{"content":"文艺复兴时期是一个关于艺术、文化和学术的复兴运动，在这个时期，许多艺术家都绘制了人体。","role":"assistant"}]',
    type: '替换',
    new: '[{"content":"You are a helpful assistant","role":"system"},{"content":"谁在文艺复兴时期绘制人体?","role":"user"},{"content":"文艺复兴时期是一个关于艺术、文化和学术的复兴运动,在这个时期,许多艺术家都绘制了人体。","role":"assistant"}]',
  },
  {
    old: '[{"content":"You are a helpful assistant","role":"system"},{"content":"谁在文艺复兴时期绘制人体?","role":"user"},{"content":"文艺复兴时期是一个关于艺术、文化和学术的复兴运动，在这个时期，许多艺术家都绘制了人体。","role":"assistant"}]',
    type: '删除',
    new: 'Session已删除',
  },
]);

const router = useRouter();

const goToNewTask = () => {
  router.push('/newTask');
};
const handleClick = (tab, event) => {
  console.log(tab, event);
};
const extractValues = (data) => {
  const result = [];

  // 遍历每个映射器
  for (const key in data) {
    const mapper = data[key];
    result.push({
      key: key,
      ...data[key],
    });
  }

  return result;
};

onMounted(() => {
  console.log('数据处理');
  tableData.value = extractValues(testData);
  console.log('tableData.value===', tableData.value);
});
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
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.statusBox {
  font-size: 12px;
  border-radius: 16px;
  width: fit-content;
  &.statusBox1 {
    color: #067647;
    border: 1px solid #abefc6;
    background: #ecfdf3;
  }
}
.optionBtn {
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  padding: 10px 14px;
  color: #344054;
  font-size: 14px;
  font-weight: 500;
}
.resultBox {
  border-radius: 12px;
  background: #0c111d;
  padding: 24px;
  height: 500px;
  overflow-y: auto;
  color: #f9fafb;

  font-family: 'Roboto Mono';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}
</style>
