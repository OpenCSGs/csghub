<template>
  <div class="p-[14px] flex items-center justify-between rounded-md border border-gray-300 mb-6">
    <textarea rows="1" :placeholder="$t('comment.createComment')" v-model="newCommentContent" class="flex-1 outline-none mr-4 text-sm text-gray-500 h-[40px]"></textarea>
    <button
      :disabled="newCommentContent.trim().length === 0"
      :class="[
        'flex justify-center items-center rounded-xs w-[88px] h-[32px] text-sm font-medium',
        newCommentContent.trim().length > 0 ? 'bg-brand-600 text-white' : 'bg-gray-100'
      ]"
      @click="createComment">
      {{ $t('comment.createComment') }}
    </button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useCookies } from "vue3-cookies";
  import { ElMessage } from 'element-plus'
  import csrfFetch from "../../packs/csrfFetch.js"

  const newCommentContent = ref('');
  const { cookies } = useCookies();

  const props = defineProps({
    commentable_type: {
      type: String,
      required: true,
    },
    commentable_id: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['createComment']);

  const createComment = async () => {
    try {
      const newComment = {
        content: newCommentContent.value,
      };

      const response = await csrfFetch('/internal_api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          commentable_type: props.commentable_type,
          commentable_id: props.commentable_id,
        })
      });

      if (response.ok) {
        const createdComment = await response.json();
        emit('createComment', createdComment);
        newCommentContent.value = ''; // Clear the input field
      } else {
        response.json().then((err) => {
          ElMessage({
            message: err.message,
            type: 'warning'
          });
        })
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>
