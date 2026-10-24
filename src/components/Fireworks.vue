<template>
  <div class="fireworks-wrap" @click="launchAt">
    <canvas ref="cv"></canvas>
    <button class="launch-btn" @click.stop="burst(5)">
      <span class="btn-bracket">[</span> 发射祝福烟花 <span class="btn-bracket">]</span>
    </button>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import confetti from 'canvas-confetti'
import { useSound } from '../composables/useSound'

const sound = useSound()
const cv = ref(null)
let ctx, raf = 0
let rockets = [], sparks = []
let autoTimer = 0

const COLORS = ['#00f0ff', '#b26bff', '#ff5ea8', '#41ff9e', '#ffc857', '#ff7a5e']

function resize() {
  const el = cv.value
  el.width = el.parentElement.clientWidth
  el.height = el.parentElement.clientHeight
}

class Rocket {
  constructor(tx, ty) {
    const W = cv.value.width, H = cv.value.height
    this.x = tx ?? W * (0.15 + Math.random() * 0.7)
    this.y = H + 10
    this.ty = ty ?? H * (0.12 + Math.random() * 0.3)
    this.vy = -(9 + Math.random() * 3)
    this.color = COLORS[(Math.random() * COLORS.length) | 0]
    this.trail = []
  }
  update() {
    this.trail.push([this.x, this.y])
    if (this.trail.length > 8) this.trail.shift()
    this.y += this.vy
    this.vy += 0.08
    if (this.y <= this.ty || this.vy >= -1) {
      explode(this.x, this.y, this.color)
      return false
    }
    return true
  }
  draw() {
    ctx.strokeStyle = this.color
    ctx.lineWidth = 2
    ctx.beginPath()
    this.trail.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
  }
}

function explode(x, y, color) {
  sound.pop()
  const n = 90 + (Math.random() * 60) | 0
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.2
    const sp = 1.5 + Math.random() * 5.5
    sparks.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      color: Math.random() > 0.3 ? color : COLORS[(Math.random() * COLORS.length) | 0]
    })
  }
}

function tick() {
  raf = requestAnimationFrame(tick)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
  ctx.fillRect(0, 0, cv.value.width, cv.value.height)
  ctx.globalCompositeOperation = 'lighter'

  rockets = rockets.filter(r => r.update())
  rockets.forEach(r => r.draw())

  sparks = sparks.filter(s => s.life > 0)
  for (const s of sparks) {
    s.x += s.vx; s.y += s.vy
    s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.045
    s.life -= s.decay
    ctx.globalAlpha = Math.max(s.life, 0)
    ctx.fillStyle = s.color
    ctx.beginPath()
    ctx.arc(s.x, s.y, 1.6 + s.life * 1.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function burst(n = 3) {
  sound.jingle()
  for (let i = 0; i < n; i++) {
    setTimeout(() => { sound.launch(); rockets.push(new Rocket()) }, i * 260)
  }
  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 42,
    origin: { y: 0.75 },
    colors: COLORS,
    zIndex: 60,
    disableForReducedMotion: true
  })
}

function launchAt(e) {
  sound.launch()
  const rect = cv.value.getBoundingClientRect()
  rockets.push(new Rocket(e.clientX - rect.left, e.clientY - rect.top))
}

onMounted(() => {
  ctx = cv.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  tick()
  burst(3)
  autoTimer = setInterval(() => {
    if (rockets.length < 3) rockets.push(new Rocket())
  }, 2600)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearInterval(autoTimer)
  window.removeEventListener('resize', resize)
})

defineExpose({ burst })
</script>

<style scoped>
.fireworks-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.launch-btn {
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 0.9em 2.4em;
  font-family: inherit;
  font-size: 1.05rem;
  letter-spacing: 0.2em;
  color: var(--neon-cyan);
  background: rgba(0, 240, 255, 0.06);
  border: 1px solid var(--neon-cyan);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 0 18px rgba(0, 240, 255, 0.25), inset 0 0 12px rgba(0, 240, 255, 0.08);
}
.launch-btn:hover {
  background: var(--neon-cyan);
  color: #001318;
  box-shadow: 0 0 42px rgba(0, 240, 255, 0.65);
}
.btn-bracket { opacity: 0.6; }
</style>
