export class Typewriter {
  queue = []
  consuming = false
  timer

  constructor(onConsume) {
    this.onConsume = onConsume
  }

  dynamicSpeed = () => {
    const speed = 2000 / this.queue.length
    return speed > 200 ? 200 : speed
  }

  add = (str) => {
    if (!str) return
    this.queue.push(...str.split(''))
  }

  consume = () => {
    if (this.queue.length > 0) {
      const str = this.queue.shift()
      str && this.onConsume(str)
    }
  }

  next = () => {
    this.consume()
    this.timer = setTimeout(() => {
      this.consume()
      if (this.consuming) {
        this.next()
      }
    }, this.dynamicSpeed())
  }

  start = () => {
    this.consuming = true
    this.next()
  }

  done = () => {
    this.consuming = false
    clearTimeout(this.timer)
    this.onConsume(this.queue.join(''))
    this.queue = []
  }
}
