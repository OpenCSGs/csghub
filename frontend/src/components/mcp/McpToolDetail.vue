<template>
  <div class="pt-4">
    <section class="flex flex-col gap-4 mb-8">
      <div class="text-gray-700 text-lg font-medium">{{ $t('mcps.tools.name') }}</div>
      <div>{{ tool.name }}</div>
    </section>

    <section class="flex flex-col gap-4 mb-8">
      <div class="text-gray-700 text-lg font-medium">{{ $t('mcps.tools.description') }}</div>
      <div>{{ tool.description }}</div>
    </section>

    <section class="flex flex-col gap-4 mb-8">
      <div class="text-gray-700 text-lg font-medium">{{ $t('mcps.tools.inputSchema') }}</div>
      <SchemaTable :data="schemaData" />
    </section>

    <section class="flex flex-col gap-4 mb-8">
      <div class="text-gray-700 text-md font-medium">
        {{ $t('mcps.tools.inputSchemaJson') }}
      </div>
      <div class="bg-[#1F1F1F] rounded-md py-4 relative group">
        <DarkCodeViewer
          :content="schemaJson"
          extension="json"
          :showLineNumbers="false"
        />
        <div
          class="absolute bg-white text-xs text-gray-700 right-6 top-6 px-4 py-2 border rounded-lg shadow cursor-pointer items-center gap-1 hidden group-hover:flex"
          @click="copyCode"
        >
          <SvgIcon name="copy" />
          Copy
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import SchemaTable from './SchemaTable.vue'
  import DarkCodeViewer from '../shared/viewers/DarkCodeViewer.vue'
  import { copyToClipboard } from '@/packs/clipboard'

  const props = defineProps({
    tool: {
      type: Object,
      required: true
    }
  })

  const schemaData = computed(() => {
    const properties = props.tool.inputSchema?.properties || {}
    const required = props.tool.inputSchema?.required || []

    return Object.entries(properties).map(([key, value]) => ({
      name: key,
      type: value.type || '-',
      description: value.description || '',
      required: required.includes(key) || required.includes(key.toLowerCase())
    }))
  })

  const schemaJson = computed(() => {
    return JSON.stringify(props.tool.inputSchema, null, 2)
  })

  const copyCode = () => {
    copyToClipboard(schemaJson.value)
  }
</script>
