<template>
  <Container
    type="mirror"
    :title="$t('admin.mirrors.mirrorDetail')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      {
        text: $t('admin.mirrors.title'),
        to: '/admin_panel/mirrors',
      },
      { text: $t('admin.detail') }
    ]"
  >
    <Card
      :title="`Mirror #${mirror.id || ''}`"
      :showFooter="false"
      v-loading="mirrorLoading"
    >
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.mirrors.sourceUrl') }}</label>
          <p class="admin-field">{{ mirror.source_url }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.mirrors.localRepoPath') }}</label>
          <p class="admin-field">{{ mirror.local_repo_path }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.status') }}</label>
          <p class="admin-field">{{ showStatus(mirror.status) }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.created_at') }}</label>
          <p class="admin-field">
            {{ dayjs(mirror.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.updated_at') }}</label>
          <p class="admin-field">
            {{ dayjs(mirror.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.mirrors.last_message') }}</label>
          <p class="admin-field">{{ mirror.last_message }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.mirrors.mirrorProgress') }}</label>
          <div class="admin-field flex-1">
            <template v-if="mirrorProgress">
              <div class="flex justify-between">
                <div class="text-sm text-gray-500 mb-2">
                  {{ $t('admin.mirrors.syncDone')}}/{{ $t('admin.mirrors.syncTotal') }} :  {{ mirrorProgress.done }}/{{ mirrorProgress.total }}
                </div>
                <div class="text-sm text-gray-500 mb-2">
                  {{ $t('admin.mirrors.mirrorProgressDetail') }}
                </div>
              </div>
              <div v-if="filteredProgress.length === 0" class="text-green-600 text-sm py-2">
                {{ $t('admin.mirrors.allDone') }}
              </div>
              <div v-else class="max-h-[300px] overflow-y-auto" ref="scrollContainer" @scroll="handleScroll">
                <div 
                  class="virtual-list-wrapper"
                  :style="{ height: totalHeight + 'px' }"
                >
                  <div
                    class="virtual-list-content"
                    :style="{ transform: `translateY(${offsetY}px)` }"
                  >
                    <div 
                      v-for="progress in visibleProgressItems" 
                      :key="progress.oid"
                      class="progress-item"
                      :style="{ height: itemHeight + 'px' }"
                    >
                      <div class="relative">
                        <el-progress
                          :stroke-width="25"
                          :percentage="progress.progress"
                          :color="'#1C7A6C'"
                          :show-text="false"
                        />
                        <div class="absolute inset-0 flex justify-between items-center px-3" style="color: #000000;">
                          <span class="text-xs">{{ progress.oid }}</span>
                          <div class="flex gap-2">
                            <span class="text-xs">{{ progress.progress }}%</span>
                            <span class="text-xs">{{ formatFileSize(progress.size) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <span class="text-sm text-gray-500">{{ $t('admin.noData') }}</span>
            </template>
          </div>
        </li>
      </ul>
      <CsgButton
        v-if="mirror.status != 'running'"
        v-loading = "syncLoading"
        class="btn btn-primary btn-md flex-1"
        :name="$t('admin.mirrors.toSync')"
        @click="toSyncMirror"
      />
    </Card>
  </Container>
</template>

<script setup>
import { Container, Card } from '../admin_component'
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../../packs/useFetchApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const mirror = ref({})
const mirrorProgress = ref(null)
const mirrorLoading = ref(false)
const syncLoading = ref(false)

// 虚拟列表相关状态
const scrollContainer = ref(null)
const scrollTop = ref(0)
const itemHeight = 33 // 每个进度条的高度
const containerHeight = 300 // 容器高度
const bufferSize = 5 // 缓冲区大小

// 只保留未完成的进度项
const filteredProgress = computed(() => {
  if (!mirrorProgress.value?.progress) return []
  return mirrorProgress.value.progress.filter(item => item.progress < 100)
})

// 计算总高度
const totalHeight = computed(() => {
  return filteredProgress.value.length * itemHeight
})

// 计算可见区域的起始索引
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize)
})

// 计算可见区域的结束索引
const endIndex = computed(() => {
  return Math.min(
    filteredProgress.value.length,
    Math.ceil((scrollTop.value + containerHeight) / itemHeight) + bufferSize
  )
})

// 计算偏移量
const offsetY = computed(() => {
  return startIndex.value * itemHeight
})

// 获取可见的进度项
const visibleProgressItems = computed(() => {
  return filteredProgress.value.slice(startIndex.value, endIndex.value)
})

// 处理滚动事件
const handleScroll = () => {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop
  }
}

// 监听数据变化，重置滚动位置
watch(() => mirrorProgress.value?.progress, () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0
      scrollTop.value = 0
    }
  })
}, { deep: true })

const showStatus = (status) => {
  return t(`admin.mirrors.status.${status}`) || t('admin.noData')
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fetchMirror = async () => {
  mirrorLoading.value = true
  const { data, error } = await useFetchApi(
    `/${route.params.type=='mcpservers'?'mcps':route.params.type}/${route.params.namespace}/${route.params.name}/mirror`
  ).json()
  if (data.value) {
    const res_json = data.value
    mirror.value = res_json.data
  } else {
    ElMessage.error(error.value.msg || 'Failed to fetch mirror')
  }
  mirrorLoading.value = false
}

const fetchMirrorProgress = async () => {
  const { data, error } = await useFetchApi(
    `/${route.params.type=='mcpservers'?'mcps':route.params.type}/${route.params.namespace}/${route.params.name}/mirror/progress`
  ).json()
  if (data.value) {
    const res_json = data.value
    mirrorProgress.value = res_json.data
  } else {
    ElMessage.error(error.value.msg || 'Failed to fetch mirrorProgress')
  }
}

const toSyncMirror = () => {
  syncLoading.value = true
  useFetchApi(`/${route.params.type=='mcpservers'?'mcps':route.params.type}/${route.params.namespace}/${route.params.name}/mirror/sync`, {
    method: 'POST',
  }).then(({ data, error }) => {
    if (data.value) {
      ElMessage.success('Sync started successfully')
      fetchMirror().catch(error => {
        ElMessage.error(error.message || 'Failed to fetch mirror')
      })
      fetchMirrorProgress().catch(error => {
        ElMessage.error(error.message || 'Failed to fetch mirror progress')
      })
    } else {
      ElMessage.error(error.value?.msg || 'Failed to start sync')
    }
    syncLoading.value = false
  }).catch(error => {
    ElMessage.error(error.message || 'Failed to start sync')
    syncLoading.value = false
  })
}

onMounted(() => {
  fetchMirror()
  fetchMirrorProgress()
})
</script>

<style scoped>
.virtual-list-wrapper {
  position: relative;
  width: 100%;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.progress-item {
  margin-bottom: 8px;
}

.progress-item:last-child {
  margin-bottom: 0;
}

/* 进度条覆盖文字的样式 */
.progress-item .relative {
  position: relative;
}

.progress-item .absolute {
  z-index: 10;
}
</style>
