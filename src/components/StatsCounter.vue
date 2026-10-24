<template>
  <div ref="root" class="stats">
    <div v-for="s in stats" :key="s.label" class="stat">
      <div class="stat-num mono" :style="{ color: s.color }">
        <span :data-target="s.value">{{ s.prefix }}{{ s.value }}{{ s.suffix }}</span>
      </div>
      <div class="stat-label">{{ s.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import anime from 'animejs/lib/anime.es.js'

const root = ref(null)
let observer = null
let played = false

const stats = [
  { value: 1024, suffix: ' 位', prefix: '', label: '正在收祝福的程序员', color: '#00f0ff' },
  { value: 0, suffix: ' 个', prefix: '', label: '今天的线上 Bug', color: '#41ff9e' },
  { value: 365, suffix: ' 天', prefix: '', label: '持续编码的热爱', color: '#ffc857' },
  { value: 999, suffix: '+', prefix: '', label: '永不掉线的灵感', color: '#ff5ea8' }
]

function play() {
  if (played) return
  played = true
  root.value.querySelectorAll('.stat-num span').forEach((el, i) => {
    const target = Number(el.dataset.target)
    const obj = { n: 0 }
    anime({
      targets: obj,
      n: target,
      round: 1,
      duration: 1800,
      delay: i * 180,
      easing: 'easeOutExpo',
      update: () => {
        el.textContent = el.textContent.replace(/[\d]+/, String(obj.n))
        // rebuild text cleanly
        const s = stats[i]
        el.textContent = s.prefix + obj.n + s.suffix
      }
    })
  })
  anime({
    targets: root.value.querySelectorAll('.stat'),
    translateY: [40, 0],
    opacity: [0, 1],
    delay: anime.stagger(140),
    duration: 900,
    easing: 'easeOutQuart'
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && play()),
    { threshold: 0.35 }
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(2rem, 6vw, 5rem);
}
.stat { text-align: center; opacity: 0; }
.stat-num {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  text-shadow: 0 0 24px currentColor;
}
.stat-label {
  margin-top: 0.5rem;
  color: var(--text-dim);
  letter-spacing: 0.25em;
  font-size: 0.85rem;
}
</style>
