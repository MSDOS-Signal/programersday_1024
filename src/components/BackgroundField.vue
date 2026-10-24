<template>
  <vue-particles id="bg-particles" :options="options" class="bg-field" />
</template>

<script setup>
const options = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 90, density: { enable: true, width: 1200, height: 800 } },
    color: { value: ['#00f0ff', '#b26bff', '#ff5ea8', '#41ff9e'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.15, max: 0.6 },
      animation: { enable: true, speed: 0.8, sync: false }
    },
    size: { value: { min: 0.6, max: 2.4 } },
    links: {
      enable: true,
      distance: 130,
      color: '#3a4a8f',
      opacity: 0.35,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.7,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'out' },
      attract: { enable: true, rotate: { x: 600, y: 1200 } }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' }
    },
    modes: {
      grab: { distance: 160, links: { opacity: 0.7, color: '#00f0ff' } },
      push: { quantity: 3 }
    }
  }
}
</script>

<style scoped>
.bg-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
