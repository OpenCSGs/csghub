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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
        
        <!-- Checkbox 复选框 -->
        <el-form-item 
            v-else-if="config.config_type === 'checkbox'" 
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <el-input
                v-model="formData[config.id].final_value"
                :placeholder="`${t('dataPipelines.toInput')}${config.display_name}`"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- Radio 单选框 -->
        <el-form-item 
            v-else-if="config.config_type === 'radio'" 
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <el-switch
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- TimePicker 时间选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'time'" 
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <el-time-picker
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
                :placeholder="`${t('dataPipelines.toSel')}${config.display_name}`"
            />
        </el-form-item>
        
        <!-- DatePicker 日期选择器 -->
        <el-form-item 
            v-else-if="config.config_type === 'date'" 
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <el-color-picker
                v-model="formData[config.id].final_value"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- Rate 评分 -->
        <el-form-item 
            v-else-if="config.config_type === 'rate'" 
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
            <el-rate
                v-model="formData[config.id].final_value"
                :max="Number(config.max_value || 5)"
                :disabled="config.is_disabled"
            />
        </el-form-item>
        
        <!-- 默认情况 - 文本输入框 -->
        <el-form-item 
            v-else
            :label="config.display_name"
            :prop="`${config.id}.final_value`"
            :rules="getRules(config)"
        >
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
            // 默认情况
            default:
                formData.value[config.id] = { final_value: defaultValue !== undefined 
                ? defaultValue 
                : null }
        }
    })
  }
  
  // 获取选项数据（模拟）
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
    }
  })
</script>

<style lang="scss" scoped>
  /* 原有的样式代码 */
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
</style>