<template>
  <div class="flex flex-col gap-2">
    <div class="flex w-full gap-2 group">
      <slot name="item" />

      <div class="flex flex-col gap-2 justify-around">
        <SvgIcon
          v-if="canManage"
          class="cursor-pointer hidden group-hover:block"
          @click="toggleRemark"
          width="16px"
          :name="repo.remark ? 'edit-2' : 'plus-square'"
        />
        <SvgIcon
          v-if="canManage"
          class="cursor-pointer hidden group-hover:block"
          @click="$emit('remove', repo.id)"
          width="16px"
          name="trash"
        />
      </div>
    </div>

    <!-- remark textarea -->
    <el-input
      v-if="showRemarkInput"
      v-model="tempRemark"
      type="textarea"
      :rows="3"
      :placeholder="$t('collections.remark')"
      maxlength="500"
      show-word-limit
    />
    <div
      v-if="showRemarkInput"
      class="flex justify-end mt-2 gap-2"
    >
      <CsgButton
        class="btn btn-secondary-gray btn-sm"
        :name="$t('all.cancel')"
        @click="cancelRemark"
      />
      <CsgButton
        class="btn btn-primary btn-sm"
        :name="$t('all.save')"
        @click="saveRemark"
      />
    </div>

    <!-- show remark -->
    <div
      v-if="repo.remark && !showRemarkInput"
      class="text-sm text-gray-600"
    >
      <span class="font-medium border-gray-200 border-l-2 pl-2"
        >{{ $t('collections.remarkTitle') }}：</span
      >
      {{ repo.remark }}
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    repo: { type: Object, required: true },
    canManage: { type: Boolean, default: true }
  })

  const emit = defineEmits(['update:remark', 'remove'])

  const showRemarkInput = ref(false)
  const tempRemark = ref('')

  const toggleRemark = () => {
    showRemarkInput.value = !showRemarkInput.value
    tempRemark.value = props.repo.remark || ''
  }

  const saveRemark = () => {
    emit('update:remark', {
      id: props.repo.id,
      remark: tempRemark.value.trim()
    })
    showRemarkInput.value = false
  }

  const cancelRemark = () => {
    showRemarkInput.value = false
  }
</script>
