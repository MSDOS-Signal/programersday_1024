<template>
  <canvas ref="cv" class="code-rain"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const cv = ref(null)
let raf = 0, ctx, drops = [], cols = 0
const CHARS = '01{}[]()<>=+-*/;:!$#@&%λΣΨΩ∫√π∞≈≠≤≥constletruntimebugfixshipit'
const FS = 15

function resize() {
  const el = cv.value
  const parent = el.parentElement
  el.width = parent.clientWidth
  el.height = parent.clientHeight
  cols = Math.floor(el.width / FS)
  drops = Array.from({ length: cols }, () => Math.random() * (el.height / FS))
}

function tick() {
  raf = requestAnimationFrame(tick)
  ctx.fillStyle = 'rgba(5, 8, 18, 0.12)'
  ctx.fillRect(0, 0, cv.value.width, cv.value.height)
  ctx.font = FS + 'px "JetBrains Mono", Consolas, monospace'

  for (let i = 0; i < cols; i++) {
    const ch = CHARS[(Math.random() * CHARS.length) | 0]
    const x = i * FS
    const y = drops[i] * FS
    // head is bright green, trail dimmer
    ctx.fillStyle = Math.random() > 0.975 ? '#d2ffe9' : '#1fd66b'
    ctx.globalAlpha = 0.55 + Math.random() * 0.45
    ctx.fillText(ch, x, y)
    ctx.globalAlpha = 1
    if (y > cv.value.height && Math.random() > 0.975) drops[i] = 0
    drops[i] += 0.6 + Math.random() * 0.4
  }
}

onMounted(() => {
  ctx = cv.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.code-rain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
