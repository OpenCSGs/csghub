<template>
  <div
    v-if="Object.keys(engineArgs).length > 0"
    class="mb-6"
  >
    <p class="text-gray-700 text-sm leading-5 mb-4">
      {{ $t('endpoints.new.engineArgs') }}
    </p>
    <div
      v-for="[variableName, variableValue] in Object.entries(engineArgs)"
      :key="variableName"
    >
      <div class="flex justify-between items-center my-2">
        <label
          :for="variableName"
          class="text-gray-600 mb-1.5 text-sm font-light w-[44.5%]"
        >
          {{ variableName }}
        </label>

        <el-select
          v-if="
            getInputTypeForEngineArg(variableName, variableValue).type ===
            'select'
          "
          v-model="engineArgs[variableName]"
          size="large"
          style="width: 100%"
          class="flex-1"
          :disabled="disabled"
          @change="handleChange(variableName, $event)"
        >
          <el-option
            v-for="option in getInputTypeForEngineArg(
              variableName,
              variableValue
            ).options"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>

        <el-switch
          v-else-if="
            getInputTypeForEngineArg(variableName, variableValue).type ===
            'switch'
          "
          v-model="engineArgs[variableName]"
          active-value="enable"
          inactive-value="disable"
          size="large"
          class="flex-1"
          :disabled="disabled"
          @change="handleChange(variableName, $event)"
        ></el-switch>

        <el-input
          v-else
          v-model="engineArgs[variableName]"
          size="large"
          class="flex-1"
          :disabled="disabled"
          @change="handleChange(variableName, $event)"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
  import getInputTypeForEngineArg from '@/packs/useEngineArgs'
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    engineArgs: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    initialArgs: {
      type: Object,
      default: () => ({})
    }
  })

  const emit = defineEmits(['update:changedArgs'])
  const changedArgs = ref({})

  onMounted(() => {
    const initialValues = JSON.parse(JSON.stringify(props.engineArgs))
    Object.keys(initialValues).forEach((key) => {
      changedArgs.value[key] = {
        initial: initialValues[key],
        changed: false
      }
    })
  })

  const handleChange = (name, value) => {
    if (changedArgs.value[name]) {
      const isChanged = value !== changedArgs.value[name].initial
      changedArgs.value[name].changed = isChanged

      const changedValues = {}
      Object.keys(changedArgs.value).forEach((key) => {
        if (changedArgs.value[key].changed) {
          changedValues[key] = props.engineArgs[key]
        }
      })

      emit('update:changedArgs', changedValues)
    }
  }
</script>
