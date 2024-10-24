<template>
  <div class="border-t border-gray-200 p-[16px]">
    <h3 class="text-[16px] text-gray-700 font-[500] mb-[16px]">{{ $t('widgets.onlineDemo') }}</h3>
    <p class="text-gray-700 text-[14px] mb-[6px]">{{ $t('widgets.testInput') }}</p>
    <el-input
      v-model="textInput"
      :rows="3"
      @input="countTextLength"
      type="textarea"
      placeholder=""
    />
    <div class="my-[16px] flex justify-end">
      <div class="hidden w-[108px] flex px-[12px] py-[8px] justify-center items-center gap-[4px] border rounded-md shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 6.66675L12.5 6.66675M12.5 6.66675C12.5 8.04746 13.6193 9.16675 15 9.16675C16.3807 9.16675 17.5 8.04746 17.5 6.66675C17.5 5.28604 16.3807 4.16675 15 4.16675C13.6193 4.16675 12.5 5.28604 12.5 6.66675ZM7.5 13.3334L17.5 13.3334M7.5 13.3334C7.5 14.7141 6.38071 15.8334 5 15.8334C3.61929 15.8334 2.5 14.7141 2.5 13.3334C2.5 11.9527 3.61929 10.8334 5 10.8334C6.38071 10.8334 7.5 11.9527 7.5 13.3334Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[14px]">参数调整</span>
      </div>
      <div class="flex justify-center items-center gap-[8px]">
        <p class="text-[16px] text-gray-500"> {{ `${$t('widgets.testInput')}: ${textInputLength}` }} / 1000 </p>
        <button v-if="loading"
                class="flex px-[12px] py-[8px] justify-center items-center gap-[4px] rounded-lg border border-gray-300 bg-gray-300 shadow-sm text-white text-[14px] font-[500]"
                @click="sendInferenceTest"
                disabled=false
        >
          {{ $t('widgets.runTest') }}
        </button>
        <button v-else
                class="flex px-[12px] py-[8px] justify-center items-center gap-[4px] rounded-lg border border-blue-700 bg-blue-700 shadow-sm text-white text-[14px] font-[500]"
                @click="sendInferenceTest"
        >
          {{ $t('widgets.runTest') }}
        </button>
      </div>
    </div>
    <p class="text-gray-700 text-[14px] mb-[6px]">{{ $t('widgets.testOutput') }}</p>
    <div class="h-[130px] p-[10px] border markdown-body rounded-md border-gray-300 bg-white shadow-xs overflow-scroll"
         v-loading="loading"
         v-html="renderMarkdown(textOutput)"
    ></div>
    <p v-if="timeSpend != 0" class="text-gray-500 text-[14px] mt-[16px]">{{ `${$t('widgets.timeCost')}: ${timeSpend}` }} ms</p>
    <div> 
      <SvgIcon name="exclamation_point" /> 
      <p class="ml-[4px] text-[12px] leading-[18px] text-gray-500">{{ $t('widgets.liabilityExemption') }}</p>
    </div>
  </div>
</template>

<script>
  import csrfFetch from "../../../packs/csrfFetch"
  import { ElMessage } from 'element-plus'
  import MarkdownIt from "markdown-it"
  import { useI18n } from 'vue-i18n'

  export default {
    props: {
      namespacePath:String,
      currentBranch: String
    },
    data() {
      return {
        timeSpend: 0,
        loading: false,
        textInput: '',
        textOutput: '',
        textInputLength: 0,
        t: useI18n()
      }
    },
    components: {},
    methods: {
      renderMarkdown(text) {
        const mdParser = new MarkdownIt();
        return mdParser.render(text);
      },
      countTextLength(input) {
        this.textInputLength = input.length
      },
      async sendInferenceTest() {
        this.timeSpend = 0
        const startTime = Date.now()
        const predictEndpoint = `/internal_api/models/${this.namespacePath}/predict`
        const payload = {
          namespace: this.namespacePath.split('/')[0],
          model_name: this.namespacePath.split('/')[1],
          current_branch: this.currentBranch,
          input: this.textInput
        }
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        }
        this.loading = true
        const response = await csrfFetch(predictEndpoint, options)
        if (!response.ok) {
          response.json().then((err) => {
            ElMessage({ message: '推理失败', type: "warning" })
          })
          this.loading = false
          this.timeSpend = Date.now() - startTime
        } else {
          response.json().then((data) => {
            this.textOutput = data.result
            this.loading = false
            this.timeSpend = Date.now() - startTime
          })
        }
      }
    }
  }
</script>