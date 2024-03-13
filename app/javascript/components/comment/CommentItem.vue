<template>
  <div v-if="comment" class="flex border-b border-[#DCDCDE] last-of-type:border-0 pb-[18px] mb-[18px]">
    <div class="mr-2">
      <el-avatar :size="32" :src="comment.user.avatar"></el-avatar>
    </div>
    <div class="w-full">
      <div class="text-[14px] leading-[22px] flex">
        <div class="text-[#303133] font-medium mr-4">{{ comment.user.name }}</div>
        <div class="text-[#909399] flex-1">{{ comment.time }}</div>
        <button v-if="current_user_id === comment.user.id.toString()" @click="confirmDelete(comment.id)" class="p-1 hover:bg-[#F0F2F5] rounded-[4px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66665 3.33301L3.05928 10.0077C3.1084 10.8428 3.13296 11.2604 3.21784 11.61C3.591 13.1471 4.83483 14.3199 6.39113 14.6021C6.74514 14.6663 7.16342 14.6663 7.99998 14.6663V14.6663C8.83653 14.6663 9.25481 14.6663 9.60883 14.6021C11.1651 14.3199 12.409 13.1471 12.7821 11.61C12.867 11.2604 12.8916 10.8428 12.9407 10.0077L13.3333 3.33301M2.66665 3.33301L1.33331 3.33301M2.66665 3.33301L13.3333 3.33301M13.3333 3.33301L14.6666 3.33301M10.6666 3.33301L10.547 2.97406C10.3503 2.38395 10.2519 2.08889 10.0695 1.87075C9.90842 1.67811 9.70154 1.529 9.46785 1.43709C9.20321 1.33301 8.89219 1.33301 8.27016 1.33301L7.7298 1.33301C7.10777 1.33301 6.79675 1.33301 6.53211 1.43709C6.29842 1.529 6.09154 1.67811 5.93045 1.87074C5.74802 2.08889 5.64967 2.38395 5.45296 2.97406L5.33331 3.33301M6.66665 6.66634L6.66664 11.333M9.33331 6.66634L9.33331 9.33301" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="text-[14px] leading-[23px] text-[#606266]">{{ comment.content }}</div>
    </div>
  </div>
</template>

<script setup>
  import { useCookies } from "vue3-cookies";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import csrfFetch from "../../packs/csrfFetch.js"
  import { useI18n } from 'vue-i18n'

  const { cookies } = useCookies();

  const props = defineProps({
    comment: {
      type: Object,
      required: true
    },
    current_user_id: {
      type: String,
      required: true,
    },
  });

  const { t } = useI18n();

  const emit = defineEmits(['deleteComment']);

  const confirmDelete = async (commentId) => {
    const confirmResult = await ElMessageBox.confirm(t('comment.sureDel'), t('all.tip'), {
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel'),
      type: 'warning',
    });

    if (confirmResult === 'confirm') {
      const response = await csrfFetch(`/internal_api/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        emit('deleteComment', commentId);
      } else {
        response.json().then(data => {
          ElMessage({
            message: data.message,
            type: 'warning'
          });
        });
      }
    }
  };
</script>
