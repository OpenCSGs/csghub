export default {
  template: '<div>Point is: {{ point }}. <button @click="inc">Inc</button></div>',
  data() {
    return { point: 1 }
  },
  methods: {
    inc() { this.point++ }
  }
}