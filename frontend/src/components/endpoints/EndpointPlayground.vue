<template>
  <div class="flex rounded-2xl border border-[#EAECF0] my-6 md:m-5 md:flex-col">
    <div class="border-r border-[#EAECF0] w-[320px] md:w-full md:border-none">
      <div
        class="p-4 flex items-center justify-between border-b border-[#EAECF0]"
      >
        <div
          class="flex items-center gap-2 text-base text-[#344054] font-medium"
        >
          <SvgIcon name="playground" />
          {{ $t('endpoints.playground.title') }}
        </div>
        <div
          class="h-11 p-1 bg-[#f8f9fb] rounded-[10px] border border-[#eaecf0] items-center gap-1 inline-flex"
        >
          <div
            class="px-3 py-2 rounded-md justify-center items-center gap-2 flex cursor-pointer hover:bg-white"
            :class="
              playgroundMode === 'test' ? 'bg-white shadow' : 'bg-[#f8f9fb]'
            "
            @click="changePlaygroundMode('test')"
          >
            <div
              class="text-[#344053] text-sm font-medium"
              :class="
                playgroundMode === 'test' ? 'text-[#344053]' : 'text-[#667084]'
              "
            >
              Test
            </div>
          </div>
          <div
            class="px-3 py-2 rounded-md justify-center items-center gap-2 flex cursor-pointer hover:bg-white"
            :class="
              playgroundMode === 'api' ? 'bg-white shadow' : 'bg-[#f8f9fb]'
            "
            @click="changePlaygroundMode('api')"
          >
            <div
              class="text-[#667084] text-sm font-medium"
              :class="
                playgroundMode === 'api' ? 'text-[#344053]' : 'text-[#667084]'
              "
            >
              API
            </div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div class="text-[#344053] text-base font-medium leading-normal mb-4">
          {{ $t('endpoints.playground.parameters') }}
        </div>
        <el-form
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
      </div>
    </div>

    <div
      v-show="playgroundMode === 'test'"
      class="flex-1"
    >
      <TestEndpoint
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="form"
      />
      <div class="px-4 mb-4 flex justify-between items-center">
        <div class="items-center gap-1.5 flex cursor-not-allowed">
          <SvgIcon name="json" />
          <div class="text-[#98a1b2] text-xs leading-[18px]">
            {{ $t('endpoints.playground.json') }}
          </div>
        </div>
        <div
          class="items-center gap-1.5 flex cursor-pointer"
          @click="dialogVisible = true"
        >
          <SvgIcon name="fullscreen" />
          <div class="text-[#475466] text-xs leading-[18px]">
            {{ $t('endpoints.playground.maximum') }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="playgroundMode === 'api'"
      class="flex-1 overflow-hidden"
    >
      <ApiExample
        :appEndpoint="appEndpoint"
        :modelId="modelId"
        :form="form"
        :private="private"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    fullscreen
    append-to-body
  >
    <TestEndpoint
      :appEndpoint="appEndpoint"
      :modelId="modelId"
      :form="form"
    />
  </el-dialog>
</template>

<script setup>
  import { ref } from 'vue'
  import ApiExample from './playground/ApiExample.vue'
  import TestEndpoint from './playground/TestEndpoint.vue'

  const props = defineProps({
    appEndpoint: String,
    modelId: String,
    private: Boolean
  })

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

  const changePlaygroundMode = (mode) => {
    playgroundMode.value = mode
  }
</script>
