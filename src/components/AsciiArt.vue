<template>
  <div ref="root" class="ascii-stage">
    <pre class="ascii-art mono" :class="{ done }"><span
      v-for="(line, i) in lines"
      :key="i"
      class="ascii-line"
      :class="{ on: shown[i] }"
      :style="{ color: lineColor(i) }"
    >{{ line }}
</span></pre>
    <p class="ascii-caption mono" :class="{ on: done }">// cat /etc/festival.txt —— 1KB = 1024B，程序员的专属进制浪漫</p>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'

const props = defineProps({
  art: { type: String, required: true },
  colors: { type: Array, default: () => ['#00f0ff', '#00e0d0', '#41ff9e', '#b26bff', '#ff5ea8', '#ffc857'] }
})

const lines = props.art.replace(/^\n+|\n+$/g, '').split('\n')
const shown = reactive(lines.map(() => false))
const done = ref(false)
const root = ref(null)
let observer = null
const timers = []

function lineColor(i) {
  return props.colors[i % props.colors.length]
}

function play() {
  lines.forEach((_, i) => {
    timers.push(setTimeout(() => {
      shown[i] = true
      if (i === lines.length - 1) timers.push(setTimeout(() => { done.value = true }, 300))
    }, 150 + i * 90))
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { play(); observer.disconnect() }
    }),
    { threshold: 0.4 }
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  timers.forEach(clearTimeout)
})
</script>

<style scoped>
.ascii-stage { text-align: center; }
.ascii-art {
  display: inline-block;
  text-align: left;
  font-size: clamp(6px, 1.7vw, 15px);
  line-height: 1.25;
  filter: drop-shadow(0 0 14px rgba(0, 240, 255, 0.25));
}
.ascii-line {
  display: block;
  white-space: pre;
  opacity: 0;
  transform: translateY(12px) scaleY(0.4);
  transform-origin: top;
  transition: opacity 0.25s, transform 0.4s cubic-bezier(0.2, 1.6, 0.4, 1);
}
.ascii-line.on { opacity: 1; transform: none; }
.ascii-art.done { animation: glow-pulse 2.6s ease-in-out infinite; }
@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.2)); }
  50% { filter: drop-shadow(0 0 26px rgba(178, 107, 255, 0.45)); }
}
.ascii-caption {
  margin-top: 1.6rem;
  color: var(--text-dim);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  opacity: 0;
  transition: opacity 0.8s;
}
.ascii-caption.on { opacity: 1; }
</style>
