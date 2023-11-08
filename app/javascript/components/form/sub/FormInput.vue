<template>
  <div>
    <form-label :forField="field" :labelName="label" :required="required" />
    <el-input v-model="inputValue"
              @input="updateValue" clearable
              :placeholder="placeholder"
              class="w-full h-[40px] text-[#606266] mt-[10px]"/>
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
    label: String,
    required: Boolean
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
