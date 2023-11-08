<template>
  <form-label :for_field="field" :label="label"/>
  <el-select v-model="filterValue" @change="updateValue" :placeholder="placeholder" size="large"
             class="w-full mt-[10px]">
    <el-option
        v-for="item in filterValues"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
    />
  </el-select>
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
      filterValue: '',
      filterValues: [
        {
          value: 'option1',
          label: '选项1'
        },
        {
          value: 'option2',
          label: '选项2'
        }
      ]
    }
  },
  methods: {
    updateValue() {
      // 向父组件发送'update:inputValue'事件，传递this.inputValue的值作为参数
      this.$emit('update:filterValue', this.filterValue)
    }
  }
}
</script>
