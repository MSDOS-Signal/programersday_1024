import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useTypewriter(lines, { typeSpeed = 70, holdMs = 2200, loop = true } = {}) {
  const display = ref('')
  const cursorVisible = ref(true)
  let timer = 0, cursorTimer = 0, stopped = false

  async function sleep(ms) {
    return new Promise(r => { timer = setTimeout(r, ms) })
  }

  async function run() {
    let idx = 0
    while (!stopped) {
      const line = lines[idx % lines.length]
      for (let i = 0; i <= line.length && !stopped; i++) {
        display.value = line.slice(0, i)
        await sleep(typeSpeed)
      }
      await sleep(holdMs)
      if (!loop && idx === lines.length - 1) return
      for (let i = line.length; i >= 0 && !stopped; i--) {
        display.value = line.slice(0, i)
        await sleep(typeSpeed / 2.4)
      }
      idx++
    }
  }

  onMounted(() => {
    run()
    cursorTimer = setInterval(() => { cursorVisible.value = !cursorVisible.value }, 530)
  })

  onBeforeUnmount(() => {
    stopped = true
    clearTimeout(timer)
    clearInterval(cursorTimer)
  })

  return { display, cursorVisible }
}
