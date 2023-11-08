<template>
  <el-input v-if="type_placeholder === false" v-model="inputValue" @input="updateValue" clearable :placeholder="placeholder" class="w-full h-[40px] text-[#606266]"/>
  <el-input v-else v-model="inputValue" @input="updateValue" clearable type="textarea" :placeholder="placeholder" class="w-full h-[70px] text-[#606266]"/>
</template>
<script>
export default {
  props: {
    name_field: String,
    placeholder: String,
    field: String,
    type_placeholder: Boolean,
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
