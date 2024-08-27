<template>
  <div>
    <CreateComment
      @createComment="createComment"
      :commentable_type="commentable_type"
      :commentable_id="commentable_id"
    />
    <CommentItem
      v-for="comment in commentListRef"
      :key="comment.id"
      :comment="comment"
      :current_user_id="current_user_id"
      @deleteComment="deleteComment"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import CreateComment from './CreateComment.vue';
  import CommentItem from './CommentItem.vue';

  const props = defineProps({
    commentable_type: {
      type: String,
      required: true,
    },
    commentable_id: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
    current_user_id: {
      type: String,
      required: true,
    },
  });

  const commentListRef = ref(JSON.parse(props.comments));

  const createComment = (newComment) => {
    commentListRef.value.unshift(newComment);
  };

  const deleteComment = (commentId) => {
    commentListRef.value = commentListRef.value.filter((comment) => comment.id !== commentId);
  };
</script>
