<template>
  <div ref="wrap" class="particle-text"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  text: { type: String, default: '1024' },
  density: { type: Number, default: 3 } // px step when sampling glyph pixels
})

const wrap = ref(null)
let renderer, scene, camera, points, raf = 0
let targets, origins, velocities, seeds, colors
let count = 0
const mouse = new THREE.Vector2(9999, 9999)
const clock = new THREE.Clock()

const WORLD_W = 100
let worldH = 40

function sampleText() {
  const c = document.createElement('canvas')
  const w = 900, h = 320
  c.width = w; c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#fff'
  ctx.font = '900 240px "JetBrains Mono", Consolas, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.text, w / 2, h / 2 + 10)
  const img = ctx.getImageData(0, 0, w, h).data
  const pts = []
  const step = props.density
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (img[(y * w + x) * 4 + 3] > 128) {
        pts.push([(x / w - 0.5) * WORLD_W, -(y / h - 0.5) * (WORLD_W * h / w)])
      }
    }
  }
  return pts
}

function buildParticles() {
  const glyph = sampleText()
  count = glyph.length
  targets = new Float32Array(count * 3)
  origins = new Float32Array(count * 3)
  velocities = new Float32Array(count * 3)
  seeds = new Float32Array(count)
  colors = new Float32Array(count * 3)
  const positions = new Float32Array(count * 3)

  const palette = [
    new THREE.Color('#00f0ff'),
    new THREE.Color('#b26bff'),
    new THREE.Color('#ff5ea8'),
    new THREE.Color('#41ff9e'),
    new THREE.Color('#ffc857')
  ]

  for (let i = 0; i < count; i++) {
    const [tx, ty] = glyph[i]
    targets[i * 3] = tx
    targets[i * 3 + 1] = ty
    targets[i * 3 + 2] = (Math.random() - 0.5) * 4

    // start scattered on a sphere shell far away
    const r = 90 + Math.random() * 60
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const sx = r * Math.sin(phi) * Math.cos(theta)
    const sy = r * Math.sin(phi) * Math.sin(theta)
    const sz = r * Math.cos(phi) * 0.4
    origins[i * 3] = sx; origins[i * 3 + 1] = sy; origins[i * 3 + 2] = sz
    positions[i * 3] = sx; positions[i * 3 + 1] = sy; positions[i * 3 + 2] = sz

    seeds[i] = Math.random() * 100
    const col = palette[(Math.random() * palette.length) | 0]
    colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  points = new THREE.Points(geo, mat)
  scene.add(points)
}

function resize() {
  if (!wrap.value || !renderer) return
  const w = wrap.value.clientWidth
  const h = wrap.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  worldH = WORLD_W / camera.aspect
  camera.updateProjectionMatrix()
}

function onPointerMove(e) {
  const rect = wrap.value.getBoundingClientRect()
  const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
  mouse.set(nx * (WORLD_W / 2) * camera.aspect, ny * worldH / 2)
}

function onPointerLeave() {
  mouse.set(9999, 9999)
}

function tick() {
  raf = requestAnimationFrame(tick)
  const dt = Math.min(clock.getDelta(), 0.05)
  const step = dt * 60 // normalize to 60fps units
  const damp = Math.pow(0.9, step)
  const t = clock.elapsedTime
  const pos = points.geometry.attributes.position.array
  const repelR = 10
  const repelR2 = repelR * repelR

  for (let i = 0; i < count; i++) {
    const ix = i * 3
    const jx = Math.sin(t * 1.4 + seeds[i]) * 0.25
    const jy = Math.cos(t * 1.1 + seeds[i] * 1.7) * 0.25
    const tx = targets[ix] + jx
    const ty = targets[ix + 1] + jy
    const tz = targets[ix + 2] + Math.sin(t * 0.9 + seeds[i] * 2.3) * 0.6

    // spring toward target
    const k = 0.04 * step
    velocities[ix] += (tx - pos[ix]) * k
    velocities[ix + 1] += (ty - pos[ix + 1]) * k
    velocities[ix + 2] += (tz - pos[ix + 2]) * k

    // mouse repulsion
    const dx = pos[ix] - mouse.x
    const dy = pos[ix + 1] - mouse.y
    const d2 = dx * dx + dy * dy
    if (d2 < repelR2 && d2 > 0.0001) {
      const d = Math.sqrt(d2)
      const f = (1 - d / repelR) * 2.2 * step
      velocities[ix] += (dx / d) * f
      velocities[ix + 1] += (dy / d) * f
    }

    velocities[ix] *= damp
    velocities[ix + 1] *= damp
    velocities[ix + 2] *= damp

    pos[ix] += velocities[ix] * step
    pos[ix + 1] += velocities[ix + 1] * step
    pos[ix + 2] += velocities[ix + 2] * step
  }

  points.geometry.attributes.position.needsUpdate = true
  points.material.opacity = 0.8 + Math.sin(t * 2) * 0.15
  points.rotation.y = Math.sin(t * 0.15) * 0.12
  renderer.render(scene, camera)
}

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500)
  camera.position.z = 55
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  wrap.value.appendChild(renderer.domElement)

  buildParticles()
  resize()
  window.addEventListener('resize', resize)
  wrap.value.addEventListener('pointermove', onPointerMove)
  wrap.value.addEventListener('pointerleave', onPointerLeave)
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  points?.geometry.dispose()
  points?.material.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
.particle-text {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
.particle-text :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
