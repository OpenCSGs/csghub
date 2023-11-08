<template>
  <div>
    <div class="flex items-center gap-[10px]">
      <form-label :for_field="field" :label="label"/>
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path
            d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
            fill="#F56C6C"/>
      </svg>
    </div>
    <el-input v-if="type_placeholder === false" v-model="inputValue" @input="updateValue" clearable
              :placeholder="placeholder" class="w-full h-[40px] text-[#606266] mt-[10px]"/>
    <el-input v-else v-model="inputValue" @input="updateValue" clearable type="textarea" :placeholder="placeholder"
              class="w-full h-auto text-[#606266] mt-[10px]"/>
  </div>
</template>
<script>
import FormLabel from "./FormLabel.vue"

export default {
  props: {
    name_field: String,
    placeholder: String,
    field: String,
    type_placeholder: Boolean,
    label: String
  },
  components: {
    FormLabel
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    updateValue() {
      // 向父组件发送'update:inputValue'事件，传递this.inputValue的值作为参数
      this.$emit('update:inputValue', this.inputValue)
    }
  }
}
</script>
