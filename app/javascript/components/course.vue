<script>
export default {
  data() {
    return {
      course: "This is Rails7 application!"
    }
  },
  mounted() {
    console.log(`The initial count is.`)
  }
}
</script>

<template>
  <p>This is: {{ course }}</p>
  <t-button>确定</t-button>
  <t-pagination :total="30" />
  <t-dropdown :options="[{ content: '操作一', value: 1 }, { content: '操作二', value: 2 }]">
    <t-button>更多...</t-button>
  </t-dropdown>
  <t-checkbox>基础多选框</t-checkbox>
</template>