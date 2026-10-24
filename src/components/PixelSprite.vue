<template>
  <div class="pixel-sprite" :style="wrapStyle">
    <i :style="dotStyle"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  art: { type: Array, required: true },       // array of strings
  palette: { type: Object, required: true },  // { char: color }
  px: { type: Number, default: 6 }
})

const rows = computed(() => props.art.length)
const cols = computed(() => Math.max(...props.art.map(r => r.length)))

const wrapStyle = computed(() => ({
  width: cols.value * props.px + 'px',
  height: rows.value * props.px + 'px'
}))

const dotStyle = computed(() => {
  const shadows = []
  props.art.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      const color = props.palette[ch]
      if (color) shadows.push(`${x * props.px}px ${y * props.px}px 0 0 ${color}`)
    })
  })
  return {
    width: props.px + 'px',
    height: props.px + 'px',
    boxShadow: shadows.join(',')
  }
})
</script>

<style scoped>
.pixel-sprite {
  position: relative;
  image-rendering: pixelated;
}
.pixel-sprite i {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  background: transparent;
}
</style>
