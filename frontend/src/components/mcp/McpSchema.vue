<template>
  <div class="flex xl:block">
    <div class="w-[280px] xl:hidden flex flex-col gap-4 pt-2 z-[1]">
      <el-affix>
        <el-anchor :offset="300">
          <el-anchor-link
            v-for="link in links"
            :key="link.href"
            :href="link.href"
          >
            {{ link.name }}
          </el-anchor-link>
        </el-anchor>
      </el-affix>
    </div>

    <div class="flex-1 pt-4">
      <section class="flex flex-col gap-4 mb-8">
        <div
          class="text-gray-700 text-lg font-medium"
          id="server-config"
        >
          {{ $t('mcps.schema.serverConfig') }}
        </div>
        <p>{{ $t('mcps.schema.serverConfigDesc') }}</p>
        <SchemaTable :data="configData" />
      </section>

      <div class="text-gray-700 text-lg font-medium mb-4">
        {{ $t('mcps.schema.title') }}
      </div>

      <section class="flex flex-col gap-4 mb-8">
        <div
          class="text-gray-700 text-md font-medium"
          id="prompts"
        >
          {{ $t('mcps.schema.prompts') }}
        </div>
        <p>{{ $t('mcps.schema.promptsDesc') }}</p>
        <SchemaTable :data="promptsData" />
      </section>

      <section class="flex flex-col gap-4 mb-8">
        <div
          class="text-gray-700 text-md font-medium"
          id="resources"
        >
          {{ $t('mcps.schema.resources') }}
        </div>
        <p>{{ $t('mcps.schema.resourcesDesc') }}</p>
        <SchemaTable :data="resourcesData" />
      </section>

      <section class="flex flex-col gap-4 mb-8">
        <div
          class="text-gray-700 text-md font-medium"
          id="tools"
        >
          {{ $t('mcps.schema.tools') }}
        </div>
        <p>{{ $t('mcps.schema.toolsDesc') }}</p>
        <SchemaTable
          :data="toolsData"
          dataType="tools"
          :hiddenColumns="['inputSchema']"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import SchemaTable from './SchemaTable.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    repo: {
      type: Object,
      required: true
    }
  })

  // configuration data
  const configData = computed(() => {
    if (!props.repo?.configuration) return []

    try {
      const parsedConfig =
        typeof props.repo.configuration === 'string'
          ? JSON.parse(props.repo.configuration)
          : props.repo.configuration

      const properties = parsedConfig?.properties || {}
      const required = parsedConfig?.required || []

      return Object.entries(properties).map(([key, value]) => ({
        name: key,
        type: value.type || '-',
        description: value.description || '',
        required: required.includes(key) || required.includes(key.toLowerCase())
      }))
    } catch (error) {
      console.error('Error parsing configuration:', error)
      return []
    }
  })

  // tools data
  const toolsData = computed(() => {
    if (!props.repo?.schema) return []

    try {
      const parsedSchema =
        typeof props.repo.schema === 'string'
          ? JSON.parse(props.repo.schema)
          : props.repo.schema

      return parsedSchema?.tools || []
    } catch (error) {
      console.error('Error parsing tools data:', error)
      return []
    }
  })

  // resources data
  const resourcesData = computed(() => {
    if (!props.repo?.schema) return []

    try {
      const parsedSchema =
        typeof props.repo.schema === 'string'
          ? JSON.parse(props.repo.schema)
          : props.repo.schema

      return (parsedSchema?.resources || []).map((resource) => ({
        name: resource.name || '-',
        description: resource.description || ''
      }))
    } catch (error) {
      console.error('Error parsing resources data:', error)
      return []
    }
  })

  // prompts data
  const promptsData = computed(() => {
    if (!props.repo?.schema) return []

    try {
      const parsedSchema =
        typeof props.repo.schema === 'string'
          ? JSON.parse(props.repo.schema)
          : props.repo.schema

      return (parsedSchema?.prompts || []).map((prompt) => ({
        name: prompt.name || '-',
        description: prompt.description || ''
      }))
    } catch (error) {
      console.error('Error parsing prompts data:', error)
      return []
    }
  })

  const links = ref([
    {
      name: t('mcps.schema.serverConfig'),
      href: '#server-config'
    },
    {
      name: t('mcps.schema.prompts'),
      href: '#prompts'
    },
    {
      name: t('mcps.schema.resources'),
      href: '#resources'
    },
    {
      name: t('mcps.schema.tools'),
      href: '#tools'
    }
  ])
</script>

<style scoped>
  :deep(.el-anchor__marker) {
    display: none !important;
  }

  :deep(.el-anchor__link) {
    padding: 8px 0;
    line-height: 24px;
    font-size: 16px;
    color: #475467;
  }

  :deep(.el-anchor__list) {
    padding-left: 0 !important;
  }

  :deep(.el-anchor__link.is-active) {
    color: #3250bd !important;
  }

  :deep(.el-affix--fixed) {
    top: 80px !important;
  }
</style>
