<template>
    <el-form 
      :model="formData" 
      label-position="top"
      ref="formRef"
      :disabled="props.viewMode === 'view'"
    >
      <div v-for="config in configs" :key="config.id">
        <!-- Select 下拉选择器 -->
        <el-form-item 
            v-if="config.config_type === 'select'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-select 
                v-model="formData[config.id].final_value" 
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
                :disabled="config.is_disabled"
            >
            <el-option
                v-for="option in getSelectOptions(config.select_options)"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
            </el-select>
        </el-form-item>
        
        <!-- SelectV2 虚拟化下拉选择器（大数据量优化） -->
        <el-form-item 
            v-else-if="config.config_type === 'select-v2'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-select-v2
                v-model="formData[config.id].final_value"
                :options="getSelectOptions(config.select_options)"
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
                :disabled="config.is_disabled"
                allow-create
                default-first-option
                filterable
                multiple
                clearable
                style="vertical-align: middle;"
            />
        </el-form-item>
        
        <!-- Checkbox 复选框 -->
        <el-form-item 
            v-else-if="config.config_type === 'checkbox'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-checkbox 
                v-model="formData[config.id].final_value" 
                :disabled="config.is_disabled"
            >
            {{ config.display_name }}
            </el-checkbox>
        </el-form-item>
        
        <!-- Slider 滑块 -->
        <el-form-item 
            v-else-if="config.config_type === 'slider'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-slider
                v-model="formData[config.id].final_value"
                :min="Number(config.min_value)"
                :max="Number(config.max_value)"
                :step="Number(config.slider_step)"
                :disabled="config.is_disabled"
                show-input
            />
        </el-form-item>
        
        <!-- Input 输入框 -->
        <el-form-item 
            v-else-if="config.config_type === 'input'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-input
                v-model="formData[config.id].final_value"
                :placeholder="`${t('dataPipelines.toInput')}${config.display_name}`"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- Radio 单选框 -->
        <el-form-item 
            v-else-if="config.config_type === 'radio'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-radio-group 
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
            >
            <el-radio
                v-for="option in getSelectOptions(config.select_options)"
                :key="option.value"
                :label="option.value"
            >
                {{ option.label }}
            </el-radio>
            </el-radio-group>
        </el-form-item>
        
        <!-- Switch 开关 -->
        <el-form-item 
            v-else-if="config.config_type === 'switch'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-switch
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- TimePicker 时间选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'time'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-time-picker
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
            />
        </el-form-item>
        
        <!-- DatePicker 日期选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'date'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-date-picker
                v-model="formData[config.id].final_value"
                type="date"
                :disabled="config.is_disabled"
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
            />
        </el-form-item>
        
        <!-- DateTimePicker 日期时间选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'datetime'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-date-picker
                v-model="formData[config.id].final_value"
                type="datetime"
                :disabled="config.is_disabled"
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
            />
        </el-form-item>
        
        <!-- InputNumber 数字输入框 -->
        <el-form-item 
            v-else-if="config.config_type === 'number'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-input-number
                v-model="formData[config.id].final_value"
                :min="Number(config.min_value)"
                :max="Number(config.max_value)"
                :step="Number(config.spinner_step || 1)"
                :disabled="config.is_disabled"
                controls-position="right"
            />
        </el-form-item>
        
        <!-- ColorPicker 颜色选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'color'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-color-picker
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- Rate 评分 -->
        <el-form-item 
            v-else-if="config.config_type === 'rate'" 
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-rate
                v-model="formData[config.id].final_value"
                :max="Number(config.max_value || 5)"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- InputTag 标签输入框 -->
        <el-form-item 
            v-else-if="config.config_type === 'input-tag'"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-input-tag
                v-model="formData[config.id].final_value"
                :placeholder="`${t('dataPipelines.toInput')}${config.display_name}`"
                :disabled="config.is_disabled"
            />
            <div class="input-tag-hint">{{ t('dataPipelines.inputTagHint') }}</div>
        </el-form-item>
        
        <!-- 默认情况 - 文本输入框 -->
        <el-form-item 
            v-else
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <template #label>
              <div class="form-item-label">
                <span class="label-text">{{ config.display_name }}</span>
                <el-popover
                  v-if="getConfigDescription(config)"
                  placement="left-start"
                  width="300"
                  trigger="hover"
                  :title="config.display_name"
                  :content="getConfigDescription(config)"
                >
                  <template #reference>
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-input
                v-model="formData[config.id].final_value"
                :placeholder="`${t('dataPipelines.toInput')}${config.display_name}`"
                :disabled="config.is_disabled"
            />
        </el-form-item>
      </div>
      
      <el-form-item v-if="props.viewMode === 'edit'">
        <div class="mt-[20px] flex justify-center w-full">
            <el-button
                type="primary"
                @click="submitForm"
            >
                {{ t('dataPipelines.saveConfiguration')}}
            </el-button>
        </div>
      </el-form-item>
    </el-form>
</template>

<script setup>
  import { ref, watch, defineExpose } from 'vue'
  import { useI18n } from "vue-i18n";
  import { QuestionFilled } from '@element-plus/icons-vue'
  const { t } = useI18n();
  
  const props = defineProps({
    configs: {
      type: Array,
      required: true,
      default: () => []
    },
    viewMode: {
      type: String,
      default: 'edit'
    },
  })
  
  const emit = defineEmits(['save'])
  
  const formData = ref({})
  const formRef = ref(null)
  const remoteLoading = ref(false)
  
  // 获取配置描述
  const getConfigDescription = (config) => {
    // 优先使用 display_description（国际化后的描述）
    if (config.display_description) {
      return config.display_description;
    }
    
    // 其次使用 config_description（原始描述）
    if (config.config_description) {
      return config.config_description;
    }
    
    // 如果都没有，返回空
    return '';
  }

  // 获取验证规则
  const getRules = (config) => {
    if (!config.is_required) return []
    
    return [
      { 
        required: true, 
        message: t('dataPipelines.fieldRequired', { field: config.display_name }),
        trigger: ['blur', 'change'] 
      }
    ]
  }

  // 处理字符串形式的数组默认值（用于 select-v2 等组件）
  const parseArrayDefaultValue = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];
    
    try {
      // 先尝试直接解析JSON
      return JSON.parse(value);
    } catch (e) {
      try {
        // 如果直接解析失败，尝试清理字符串格式
        const cleanedValue = value
          .trim()
          // 替换各种引号类型为标准的双引号
          .replace(/[''']/g, '"')
          .replace(/['`]/g, '"')
          // 确保方括号存在
          .replace(/^([^[]*)(.*)([^]]*)$/, '$2')
          .replace(/^[^[]*\[/, '[')
          .replace(/\][^]]*$/, ']');
        
        return JSON.parse(cleanedValue);
      } catch (parseError) {
        console.warn('Failed to parse default value as array:', value, parseError);
        
        // 最后尝试手动分割字符串
        if (value.includes(',')) {
          return value
            .replace(/[\[\]'"''`]/g, '') // 移除所有括号和引号
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        }
        
        return [];
      }
    }
  }

  // 处理 input-tag 组件的字符串数组解析（支持包含逗号等特殊字符的元素）
  const parseInputTagArrayValue = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];
    
    const trimmed = value.trim();
    
    // 如果不是数组格式，返回空数组
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return [];
    }
    
    try {
      // 先尝试直接解析JSON（处理双引号格式）
      return JSON.parse(trimmed);
    } catch (e) {
      try {
        // 处理单引号格式：将单引号替换为双引号
        const cleanedValue = trimmed.replace(/'/g, '"');
        return JSON.parse(cleanedValue);
      } catch (e2) {
        try {
          // 使用正则表达式匹配引号内的内容（支持单引号和双引号）
          // 匹配模式：引号内的内容，包括空字符串
          const matches = [];
          const regex = /(['"])((?:\\.|(?!\1).)*?)\1/g;
          let match;
          
          while ((match = regex.exec(trimmed)) !== null) {
            // match[2] 是引号内的内容，需要处理转义字符
            let content = match[2];
            // 处理转义字符
            content = content.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            matches.push(content);
          }
          
          if (matches.length > 0) {
            return matches;
          }
        } catch (e3) {
          console.warn('Failed to parse input-tag array value:', value, e3);
        }
      }
    }
    
    return [];
  }
  
  // 初始化表单数据
  const initFormData = () => {
    formData.value = {} // 清空旧数据
  
    props.configs.forEach(config => {
        // 处理默认值为 null/undefined 的情况
        const defaultValue = config.final_value || config.default_value
        
        // 根据不同类型初始化数据
        switch(config.config_type) {
            // 选择类组件
            case 'select':
                if (defaultValue === null || defaultValue === undefined) {
                    formData.value[config.id] = { final_value: null }
                } else if (Array.isArray(defaultValue)) {
                    formData.value[config.id] = { final_value: defaultValue[0] ?? null }
                } else {
                    formData.value[config.id] = { final_value: defaultValue }
                }
                break
            case 'select-v2':
                // 处理select-v2的初始化，特别处理字符串形式的数组
                if (defaultValue === null || defaultValue === undefined) {
                    formData.value[config.id] = { final_value: [] }
                } 
                else if (typeof defaultValue === 'string') {
                    formData.value[config.id] = { final_value: parseArrayDefaultValue(defaultValue) }
                    console.log('formData[config.id].final_value', formData.value[config.id].final_value)
                }
                else if (Array.isArray(defaultValue)) {
                    formData.value[config.id] = { final_value: [...defaultValue] }
                }
                else {
                    formData.value[config.id] = { final_value: [defaultValue] }
                }
                break
            case 'radio':
            case 'cascader':
            case 'tree-select':
                formData.value[config.id] = { final_value: defaultValue !== undefined 
                ? defaultValue 
                : (config.select_options?.[0]?.value ?? null) }
                break
            // 多选类组件
            case 'checkbox-group':
            case 'select-multiple':
                // 处理多选组件的初始化
                if (defaultValue === null || defaultValue === undefined) {
                    formData.value[config.id] = { final_value: [] }
                } 
                else if (typeof defaultValue === 'string') {
                    formData.value[config.id] = { final_value: defaultValue.trim() === '' 
                        ? [] 
                        : defaultValue.split(',').map(item => item.trim()) }
                }
                else if (Array.isArray(defaultValue)) {
                    formData.value[config.id] = { final_value: [...defaultValue] }
                }
                else {
                    formData.value[config.id] = { final_value: [defaultValue] }
                }
                break
            // 开关类组件
            case 'checkbox':
            case 'switch':
                formData.value[config.id] = { final_value: defaultValue === 'true' || defaultValue === true }
                break
            // 数值类组件
            case 'slider':
            case 'input-number':
            case 'rate':
                formData.value[config.id] = { final_value: defaultValue !== undefined 
                ? Number(defaultValue) 
                : (config.min_value !== undefined ? Number(config.min_value) : 0) }
                break
            // 日期时间类组件
            case 'date':
            case 'datetime':
            case 'time':
                formData.value[config.id] = { final_value: defaultValue || null }
                break
            // 颜色选择器
            case 'color':
                formData.value[config.id] = { final_value: defaultValue || '#409EFF' }
                break
            // 上传组件
            case 'upload':
                formData.value[config.id] = { final_value: defaultValue || [] }
                break
            // 文本类组件
            case 'input':
            case 'textarea':
            case 'input-password':
                formData.value[config.id] = { final_value: defaultValue || '' }
                break
            // 标签输入组件
            case 'input-tag':
                if (defaultValue === null || defaultValue === undefined) {
                    formData.value[config.id] = { final_value: [] }
                } 
                else if (Array.isArray(defaultValue)) {
                    // 如果是数组，直接使用，保持原样（包括包含逗号的值）
                    formData.value[config.id] = { final_value: [...defaultValue] }
                }
                else if (typeof defaultValue === 'string') {
                    // 使用专门的解析函数，支持包含逗号等特殊字符的元素
                    const parsed = parseInputTagArrayValue(defaultValue)
                    formData.value[config.id] = { final_value: parsed }
                }
                else {
                    // 其他类型转换为字符串后作为单个元素
                    formData.value[config.id] = { final_value: [String(defaultValue)] }
                }
                break
            // 默认情况
            default:
                formData.value[config.id] = { final_value: defaultValue !== undefined 
                ? defaultValue 
                : null }
        }
    })
  }
  
  // 获取选项数据
  const getSelectOptions = (optionIds) => {
    // 实际项目中应该从API获取选项数据
    return optionIds?.map(item => ({
      value: item.value,
      label: item.label
    })) || []
  }
  
  // 提交表单
  const submitForm = async () => {
    try {
      await formRef.value.validate()
      handleSave()
    } catch (error) {
      console.log('表单验证失败:', error)
    }
  }
  
  // 保存配置
  const handleSave = () => {
    const newConfigs = props.configs.map(config => {
      return {
        ...config,
        final_value: formData.value[config.id].final_value
      }
    })
    emit('save', newConfigs)
  }
  
  // 监听configs变化重新初始化表单
  watch(() => props.configs, () => {
    initFormData()
  }, { immediate: true })

  defineExpose({
    validate: () => {
        return formRef.value.validate()
    },
    handleSave
  })
</script>

<style lang="scss" scoped>
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }

  :deep(.el-input-number__increase) {
    right: 2px;
    top: 2px;
    padding: 9px 0;
    border-radius: 0 8px 0 0 !important;
  }
  :deep(.el-input-number__decrease) {
    padding: 9px 0;
    bottom: 2px;
    right: 2px !important;
    border-radius: 0 0 8px 0 !important;
  }
  :deep(.el-select__wrapper) {
    height: auto;
    min-height: 40px;
  }

  :deep(.el-form-item__label) {
    width: 100% !important;
    padding: 0 0 8px 0 !important;
  }

  :deep(.form-item-label) {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    min-width: 100%;
    
    .label-text {
      font-weight: 500;
      color: #606266;
      flex-shrink: 0;
    }
  }

  :deep(.help-icon) {
    color: #c0c4cc;
    font-size: 14px;
    transition: color 0.2s;
    flex-shrink: 0;
    margin-left: auto;
    
    &:hover {
      color: #409eff;
    }
  }

  .input-tag-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
  }

  // 让 el-input-tag 样式与 el-input 保持一致
  :deep(.el-input-tag) {
    padding: 4px 8px;

    .el-input-tag__wrapper {
      border: 1px solid transparent;
      border-radius: var(--border-radius-md);
      background-color: #fff;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow 0.2s;
      min-height: 32px;
      
      &:hover {
        border-color: transparent;
      }
      
      &.is-focus {
        border: 1px solid var(--Brand-300);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(77, 106, 214, 0.24);
      }
    }
    
    .el-input-tag__input {
      height: auto;
      min-height: 32px;
      line-height: 1.5;
      padding: 0 8px;
      font-size: 14px;
      color: #606266;
      
      &::placeholder {
        color: #c0c4cc;
      }
    }

    .el-input-tag__inner.is-right-space {
      margin: 0;
    }
    .el-input-tag__inner.is-left-space {
      margin: 0;
    }
  }
  
  // 错误状态样式
  :deep(.el-form-item.is-error .el-input-tag) {
    .el-input-tag__wrapper {
      border: 1px solid var(--Error-300);
      box-shadow: unset;
      
      &.is-focus {
        border: 1px solid var(--Error-300);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(240, 68, 56, 0.24);
      }
    }
  }
</style>