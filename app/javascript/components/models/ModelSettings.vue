<template>
  <div class="flex flex-col gap-[24px] border-2 rounded-[8px] my-[32px] p-[24px]">
    <div class="flex flex-col gap-[8px]">
      <div class="flex items-center w-[900px]">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M14.6663 5.99984C14.6663 7.6665 12.6663 11.3332 7.99967 11.3332C3.33301 11.3332 1.33301 7.6665 1.33301 5.99984C1.33301 4.33317 3.33301 0.666504 7.99967 0.666504C12.6663 0.666504 14.6663 4.33317 14.6663 5.99984Z"
              stroke="#606266" stroke-linecap="round"/>
          <path
              d="M9.99967 5.99984C9.99967 7.10441 9.10424 7.99984 7.99967 7.99984C6.89511 7.99984 5.99967 7.10441 5.99967 5.99984C5.99967 4.89527 6.89511 3.99984 7.99967 3.99984C9.10424 3.99984 9.99967 4.89527 9.99967 5.99984Z"
              stroke="#606266" stroke-linecap="round"/>
        </svg>
        <p class="ml-[20px] text-xl font-semibold">Change dataset visibility</p>
      </div>
      <div class="text-[14px] w-[900px] ml-[36px] text-[#606266]">
        <p class="inline-block">This dataset is currently</p>
        <p class="text-[#303133] whitespace-pre-wrap inline-block"> 【private】 </p>
        <div class="flex">
          <p class="">. Only you (personal dataset) or members of your organization
            (organization dataset) can see and commit to this dataset.</p></div>
      </div>
      <div class="w-[900px]">
        <div class="ml-[36px]">
          <el-select v-model="selectedValue">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="border-b-2"></div>
    <div class="flex flex-col gap-[8px]">
      <div class="flex items-center w-[900px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M2.66634 3.3335L3.09677 10.6507C3.17992 12.0643 3.22149 12.7711 3.52319 13.3075C3.78878 13.7797 4.19189 14.1597 4.67885 14.3971C5.23202 14.6668 5.94003 14.6668 7.35607 14.6668H8.64328C10.0593 14.6668 10.7673 14.6668 11.3205 14.3971C11.8075 14.1597 12.2106 13.7797 12.4762 13.3075C12.7779 12.7711 12.8194 12.0643 12.9026 10.6507L13.333 3.3335M2.66634 3.3335H1.33301M2.66634 3.3335H13.333M13.333 3.3335H14.6663M10.6663 3.3335L10.3644 2.42753C10.2332 2.03412 10.1676 1.83742 10.046 1.69199C9.93863 1.56356 9.80072 1.46416 9.64492 1.40288C9.4685 1.3335 9.26115 1.3335 8.84646 1.3335H7.15289C6.7382 1.3335 6.53085 1.3335 6.35443 1.40288C6.19863 1.46416 6.06071 1.56356 5.95332 1.69199C5.8317 1.83742 5.76613 2.03412 5.635 2.42753L5.33301 3.3335M6.66634 6.66683V11.3335M9.33301 6.66683V9.3335"
              stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="ml-[20px] text-xl font-semibold">Delete this dataset</p>
      </div>
      <div class="flex text-[14px] w-[900px] ml-[36px] text-[#606266]">
        <p>This action</p>
        <p class="text-[#303133] whitespace-pre-wrap"> cannot </p>
        <p> be undone. This will permanently delete the</p>
        <p class="text-[#303133] whitespace-pre-wrap"> username/datasetname </p>
        <p>dataset repository and
          all its files.</p>
      </div>
      <div class="w-[900px]">
        <div class="flex flex-col gap-[16px] ml-[36px]">
          <div class="flex flex-col gap-[8px] mt-[8px] text-[#606266] text-[14px]">
            <div class="flex">
              <p>Please type</p>
              <p class="text-[#303133] whitespace-pre-wrap"> username/datasetname </p>
              <p>to confirm.</p>
            </div>
            <el-input v-model="decs"></el-input>
          </div>
          <a @click="confirmDialogVisible = true">
            <div
                id="confirmDelete"
                class="w-[224px] py-[8px] px-[12px] border border-[#EAECF0] bg-[#EAECF0] rounded-[8px] font-medium text-[14px] text-[#98A2B3]"
                :class="decs !== '' ? 'bg-[#D92D20] text-[#FFFFFF]': ''"
                @mouseover="handleMouseOver"
                @mouseleave="handleMouseLeave"
              >
              <p>I understand, move this dataset</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <el-dialog v-model="confirmDialogVisible" title="Change model visibility" width="30%" class="dialogWidth"
               style="border-radius: 0.5rem;" left>
      <div class="py-[32px]">
        <p>After changing visibility to Public， anyone on the internet can see this dataset. Only you (personal dataset)
          or members of your organization (organization dataset) can commit.</p>
      </div>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="confirmDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="confirmDialogVisible = false">
              添加
            </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref} from "vue"


let selectedValue = ref('Private')
const options = [
  {value: 'private', label: 'Private'},
  {value: 'public', label: 'Public'},
]


let decs = ref('')
let confirmDialogVisible = ref(false)

function handleMouseOver() {
  if (decs.value !== '') {
    document.getElementById('confirmDelete').classList.add('bg-[#B42318]')
  }
}

function handleMouseLeave() {
  document.getElementById('confirmDelete').classList.remove('bg-[#B42318]')
}
</script>
