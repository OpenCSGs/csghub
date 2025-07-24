<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex justify-between">
        <CsgButton 
          class="btn btn-primary btn-sm w-fit"
          @click="showNewDiscussion"
          svgName="plus"
          :name="$t('community.discussion.new')"
        />
    </div>
    <EmptyCommunity v-if="theCards.length <= 0" @changeFlag="showNewDiscussion" />
    <template v-else>
      <DiscussionCard 
        v-for="card in theCards" 
        @click="showDetails(card)"
        :key="card.id"
        :discussionId="card.id"
        :num="card.id" 
        :title="card.title"
        :time="formatDate(card.created_at)"
        :user="card.user.name"
        :userAvatar="card.user.avatar"
        :commentNum="card.comment_count"/> 
    </template>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import EmptyCommunity from "./EmptyCommunity.vue"
  import DiscussionCard from "./DiscussionCard.vue"
  import dayjs from 'dayjs'
  import { format } from 'timeago.js'
  import { beiJingTimeParser } from '../../packs/utils'

  const props = defineProps({
    cards: Array
  })

  const emit = defineEmits(['getDiscussion', 'updateDetails', 'changeFlag', 'showDiscussionDetail', 'showNewDiscussion'])

  const theCards = ref(props.cards || [])

  watch(() => props.cards, (newCards) => {
    theCards.value = newCards || []
  }, { immediate: true, deep: true })

  const formatDate = (date) => {
    if (!date) {
      return ""
    }
    
    try {
      const parsedTime = beiJingTimeParser(date)
      const now = new Date()
      const diffInDays = Math.abs(now - parsedTime) / (1000 * 60 * 60 * 24)
      
      if (diffInDays <= 7) {
        const locale = 'zh_CN'
        return format(parsedTime, locale)
      } else {
        return dayjs(parsedTime).format('YYYY-MM-DD')
      }
    } catch (error) {
      return dayjs(date).format('YYYY-MM-DD')
    }
  }

  const showDetails = (card) => {
    emit('showDiscussionDetail', card)
  }

  const showNewDiscussion = () => {
    emit('showNewDiscussion')
  }
</script>
