
import SvgIcon from '../shared/SvgIcon.vue';
<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="collections" />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ $t('collections.newCollection.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ $t('collections.newCollection.titleDesc') }}</p>
    <div class="mt-9">
      <!-- 合集名称选择 -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">{{ $t('collections.newCollection.owner') }}</p>
          <el-select v-model="owner" :placeholder="$t('all.select')" style="width: 312px">
            <el-option
              v-for="item in namespaces"
              :key="item[0]"
              :label="item[1]"
              :value="item[0]"
            />
          </el-select>
        </div>
        <div class="md:hidden">
          <p class="h-8"></p>
          <p class="text-[#909399] text-xl font-light">/</p>
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('collections.newCollection.collectionName') }}</p>
          <el-input v-model="collectionName" :placeholder="$t('rule.collectionNameRule')" style="width: 312px">
            <template #suffix>            
              <InputTip :content="$t('collections.newCollection.tip')" />
            </template>
          </el-input>
        </div> 
      </div>

      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('collections.newCollection.collectionNickName') }}</p>
          <el-input v-model="collectionNickName" :placeholder="$t('all.inputNickNamePlc')" style="width: 312px"/>
        </div>
        <div class="">
          <p class="text-[#303133] text-sm mb-2">{{ $t('collections.newCollection.selectTheme') }}</p>
          <el-select v-model="colorName" :placeholder="$t('all.select')" style="width: 312px">
            <el-option
              v-for="item in colorNameList"
              :key="item[0]"
              :label="item[1]"
              :value="item[0]"
            />
            <template #prefix>     
              <SvgIcon name="blue" />
            </template>
          </el-select>
        </div>
      </div>

      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('collections.newCollection.collectionDesc') }}</p>
          <el-input v-model="collectionDesc"
                    :rows="6"
                    type="textarea"
                    :placeholder="this.$t('all.inputDescPlc')" />
        </div>
      </div>

      <hr class="mb-9" />
      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
            {{ $t('collections.newCollection.public') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('collections.newCollection.publicDesc') }}</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            {{ $t('collections.newCollection.private') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('collections.newCollection.privateDesc') }}</p>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createCollection"
          :disabled="!canCreateCollection || hasCreateCollection"
        >
          {{ $t('collections.newCollection.createCollection') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-radio__input) {
    margin-top: 4px;
  }

  :deep(.el-radio__label) {
    color: #344054 !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked ) {
    border: 2px solid #3250BD;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250BD;
    border-color: #3250BD;
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: 8px;
  }
</style>

<script setup>
  import InputTip from '../shared/inputs/InputTip.vue'
  import { ref, computed, onMounted, inject } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  const props = defineProps({
    namespaces: Array,
  })

  const { t } = useI18n();
  const nameRule = inject('nameRule')

  const owner = ref(props.namespaces[0][0])
  const collectionName = ref('')
  const collectionNickName = ref('')
  const collectionDesc = ref('')
  const visibility = ref('private')
  const hasCreateCollection = ref(false)
  const colorNameList = ref([
    ["blue", "蓝色"],
    ["red", "红色"]
  ])
  const colorName = ref(colorNameList.value[0][0])

  const canCreateCollection = computed(() => { return nameRule.test(collectionName.value) })
</script>
