<!-- 提示词库根页面 -->
<template>
  <div class="grow text-[#101828] w-full overflow-y-auto">
    <PromptsIndex
      v-if="theCurrentComponent === 'PromptsIndex'"
      @changeCurrentComponent="changeCurrentComponent"
    />
    <PromptsList
      v-if="theCurrentComponent === 'PromptsList'"
      :namespace="namespace"
      :name="name"
      @changeCurrentComponent="changeCurrentComponent"
      @setPromptsDetails="setPromptsDetails"
      @setRelationsModels="setRelationsModels"
    />
    <PromptsDetails
      v-if="theCurrentComponent === 'PromptsDetails'"
      :namespace="namespace"
      :name="name"
      :filePath="filePath"
      @changeCurrentComponent="changeCurrentComponent"
      @setPromptsDetails="setPromptsDetails"
    />
    <NewPromptsList
      v-if="theCurrentComponent === 'newPromptsList'"
      :namespace="namespace"
      :name="name"
      :licenses="JSON.parse(licenses)"
    />
    <PromptsListSettings
      v-if="theCurrentComponent === 'promptsListSettings'"
      :namespace="namespace"
      :name="name"
      :promptsDetails="thePromptsDetails"
      :relationsModels="theRelationsModels"
    />
    <NewPrompt
      v-if="theCurrentComponent === 'newPrompt'"
      :namespace="namespace"
      :name="name"
    />
    <EditPrompt
      v-if="theCurrentComponent === 'editPrompt'"
      :namespace="namespace"
      :name="name"
      :filePath="filePath"
      :promptsDetails="thePromptsDetails"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PromptsIndex from './PromptsIndex.vue'
  import PromptsList from './PromptsList.vue'
  import PromptsDetails from './PromptsDetails.vue'
  import NewPromptsList from './NewPromptsList.vue'
  import PromptsListSettings from './PromptsListSettings.vue'
  import NewPrompt from './NewPrompt.vue'
  import EditPrompt from './EditPrompt.vue'

  const props = defineProps({
    currentComponent: String,
    namespace: String,
    name: String,
    filePath: String,
    licenses: String
  })

  const theCurrentComponent = ref(props.currentComponent)
  const thePromptsDetails = ref()
  const theRelationsModels = ref()

  const changeCurrentComponent = (currentComponent) => {
    theCurrentComponent.value = currentComponent;
  }

  const setPromptsDetails = (promptsDetails, currentComponent = null) => {
    thePromptsDetails.value = promptsDetails;
    theCurrentComponent.value = currentComponent ? currentComponent : theCurrentComponent.value;
  }

  const setRelationsModels = (relationsModels) => {
    theRelationsModels.value = relationsModels;
  }
</script>
