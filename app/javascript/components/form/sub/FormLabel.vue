<template>
  <label :for="for_field">{{ label }}</label>
</template>
<script>
export default {
  props: {
    for_field: String,
    label: String,
  },
  data () {
    return {}
  },
  components: {},
  mounted() {}
}
</script>
