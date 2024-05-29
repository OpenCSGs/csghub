<template>
  <div class="my-[16px]">
    <el-select v-model="currentInstance" placeholder="Select" style="width: 240px">
      <el-option
        v-for="instance in instances"
        :key="instance.name"
        :label="instance.name"
        :value="instance.name"
      />
    </el-select>
    <div class="h-[80vh] border mt-[8px]">

    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    instances: Array,
    modelId: String,
    deployId: Number
  })

  const defaultInstance = computed(() => {
    if (props.instances.length !== 0) {
      return props.instances[0].name
    } else {
      return ''
    }
  })

  const currentInstance = ref(defaultInstance)
</script>