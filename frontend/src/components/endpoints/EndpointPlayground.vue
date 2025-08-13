<template>
  <div class="flex rounded-2xl border border-gray-200 my-6 md:m-5 md:flex-col">
    <div class="border-r border-gray-200 w-[320px] md:w-full md:border-none">
      <div
        class="p-4 flex items-center justify-between border-b border-gray-200"
      >
        <div
          class="flex items-center gap-2 text-base text-gray-700 font-medium"
        >
          <SvgIcon name="playground" />
          {{ $t('endpoints.playground.title') }}
        </div>
        <div
          class="h-11 p-1 bg-gray-50 rounded-lg border border-gray-200 items-center gap-1 inline-flex"
        >
          <div
            class="px-3 py-2 rounded-md justify-center items-center gap-2 flex cursor-pointer hover:bg-white"
            :class="
              playgroundMode === 'test' ? 'bg-white shadow' : 'bg-gray-50'
            "
            @click="changePlaygroundMode('test')"
          >
            <div
              class="text-gray-700 text-sm font-medium"
              :class="
                playgroundMode === 'test' ? 'text-gray-700' : 'text-gray-500'
              "
            >
              Test
            </div>
          </div>
          <div
            class="px-3 py-2 rounded-md justify-center items-center gap-2 flex cursor-pointer hover:bg-white"
            :class="playgroundMode === 'api' ? 'bg-white shadow' : 'bg-gray-50'"
            @click="changePlaygroundMode('api')"
          >
            <div
              class="text-gray-500 text-sm font-medium"
              :class="
                playgroundMode === 'api' ? 'text-gray-700' : 'text-gray-500'
              "
            >
              API
            </div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div class="text-gray-700 text-base font-medium leading-normal mb-4">
          {{ $t('endpoints.playground.parameters') }}
        </div>
        <el-form
          v-if="['text-generation', 'image-text-to-text'].includes(task)"
          :model="form"
          label-width="auto"
          label-position="top"
          class="max-w-[288px] md:max-w-full"
        >
          <el-form-item label="Top P">
            <el-select
              v-model="form.top_p"
              size="large"
            >
              <el-option
                v-for="top_p in topPRange"
                :key="top_p"
                :label="top_p"
                :value="top_p"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Top K">
            <el-select
              v-model="form.top_k"
              size="large"
            >
              <el-option
                v-for="top_k in topKRange"
                :key="top_k"
                :label="top_k"
                :value="top_k"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Temperature">
            <el-select
              v-model="form.temperature"
              size="large"
            >
              <el-option
                v-for="temperature in temperatureRange"
                :key="temperature"
                :label="temperature"
                :value="temperature"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Repetition Penalty">
            <el-select
              v-model="form.repetition_penalty"
              size="large"
            >
              <el-option
                v-for="repetition_penalty in repetitionPenaltyRange"
                :key="repetition_penalty"
                :label="repetition_penalty"
                :value="repetition_penalty"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Max Tokens">
            <el-select
              v-model="form.max_tokens"
              size="large"
            >
              <el-option
                v-for="max_tokens in maxTokensRange"
                :key="max_tokens"
                :label="max_tokens"
                :value="max_tokens"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          v-else-if="task == 'text-to-image'"
          :model="formImg"
          :rules="rules"
          ref="formRef"
          label-width="auto"
          label-position="top"
          class="max-w-[288px] md:max-w-full"
        >
          <el-form-item label="Height">
            <el-input-number
              v-model="formImg.height"
              placeholder="number"
              size="large"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="Width">
            <el-input-number
              v-model="formImg.width"
              placeholder="number"
              size="large"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="Num. Inference Steps">
            <el-input-number
              v-model="formImg.num"
              placeholder="number"
              size="large"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="Guidance Scale">
            <el-input-number
              v-model="formImg.guidance"
              placeholder="number"
              size="large"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="Negative Prompt">
            <el-input
              v-model="formImg.negativePrompt"
              size="large"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="Seed">
            <el-input-number
              v-model="formImg.seed"
              placeholder="number"
              size="large"
              class="w-full"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div
      v-show="playgroundMode === 'test'"
      class="flex-1"
      :class="{ 'simulated-fullscreen': isFullscreen }"
    >
      <div :class="{ 'page-responsive-width': isFullscreen }">
        <TestEndpoint
          v-if="task == 'text-generation'"
          :appEndpoint="appEndpoint"
          :modelId="modelId"
          :form="form"
        />
        <TestWidget
          v-else-if="task == 'text-to-image'"
          :appEndpoint="appEndpoint"
          :modelId="modelId"
          :form="formImg"
        />
        <TestExtraction
          v-else-if="task == 'feature-extraction'"
          :appEndpoint="appEndpoint"
          :modelId="modelId"
          :form="formImg"
        />
        <TestImageText
          v-else-if="task == 'image-text-to-text'"
          :appEndpoint="appEndpoint"
          :modelId="modelId"
          :form="form"
        />
        <div class="px-4 mb-4 flex justify-between items-center">
          <div class="items-center gap-1.5 flex cursor-not-allowed">
            <SvgIcon name="json" />
            <div class="text-gray-400 text-xs leading-[18px]">
              {{ $t('endpoints.playground.json') }}
            </div>
          </div>
          <div
            class="items-center gap-1.5 flex cursor-pointer"
            @click="openFullscreen"
          >
            <SvgIcon name="fullscreen" />
            <div class="text-gray-700 text-xs leading-[18px]">
              {{
                isFullscreen
                  ? $t('endpoints.playground.exitFullscreen')
                  : $t('endpoints.playground.maximum')
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="playgroundMode === 'api'"
      class="flex-1 overflow-hidden"
    >
      <ApiExample
        v-if="task == 'text-generation'"
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="form"
        :private="private"
      />
      <ApiWidget
        v-else-if="task == 'text-to-image'"
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="formImg"
        :private="private"
      />
      <ApiExtraction
        v-else-if="task == 'feature-extraction'"
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="formImg"
        :private="private"
      />
      <ApiImageText
        v-else-if="task == 'image-text-to-text'"
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="form"
        :private="private"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import ApiExample from './playground/ApiExample.vue'
  import TestEndpoint from './playground/TestEndpoint.vue'
  import TestWidget from './playground/TestWidget.vue'
  import ApiWidget from './playground/ApiWidget.vue'
  import TestExtraction from './playground/TestExtraction.vue'
  import ApiExtraction from './playground/ApiExtraction.vue'
  import TestImageText from './playground/TestImageText.vue'
  import ApiImageText from './playground/ApiImageText.vue'

  const props = defineProps({
    appEndpoint: String,
    modelId: String,
    private: Boolean,
    task: String
  })

  const isFullscreen = ref(false)
  const dialogVisible = ref(false)

  const topPRange = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
  const topKRange = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const temperatureRange = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  const repetitionPenaltyRange = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0
  ]
  const maxTokensRange = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]

  const playgroundMode = ref('test') // test, api

  const form = ref({
    top_p: 0.9,
    top_k: 10,
    temperature: 0.2,
    repetition_penalty: 1.0,
    max_tokens: 200
  })
  const formImg = ref({
    height: null,
    width: null,
    num_inference_steps: null,
    guidance_scale: null,
    negative_prompt: '',
    seed: null
  })

  const openFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape' && isFullscreen.value) {
      isFullscreen.value = false
    }
  }

  watch(isFullscreen, (newValue) => {
    if (newValue) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  })
  const changePlaygroundMode = (mode) => {
    playgroundMode.value = mode
  }
</script>
<style scoped>
  :deep(.el-input-number) {
    width: 100% !important;
  }
  .simulated-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: white;
    z-index: 999;
    overflow-y: auto;
  }
</style>
