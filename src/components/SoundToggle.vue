<template>
  <button class="sound-toggle mono" :class="{ on: sound.enabled.value }" @click="sound.toggle">
    <span class="eq" v-if="sound.enabled.value"><i></i><i></i><i></i><i></i></span>
    <span v-else class="mute-icon">∅</span>
    SOUND: {{ sound.enabled.value ? 'ON' : 'OFF' }}
  </button>
</template>

<script setup>
import { useSound } from '../composables/useSound'
const sound = useSound()
</script>

<style scoped>
.sound-toggle {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  color: var(--text-dim);
  background: rgba(10, 13, 28, 0.8);
  border: 1px solid rgba(120, 140, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s;
}
.sound-toggle:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); }
.sound-toggle.on {
  color: var(--neon-green);
  border-color: rgba(65, 255, 158, 0.6);
  box-shadow: 0 0 18px rgba(65, 255, 158, 0.2);
}
.mute-icon { font-size: 0.9rem; }
.eq { display: flex; align-items: flex-end; gap: 2px; height: 12px; }
.eq i {
  width: 3px;
  background: var(--neon-green);
  animation: eq 0.7s ease-in-out infinite;
}
.eq i:nth-child(1) { height: 5px; animation-delay: 0s; }
.eq i:nth-child(2) { height: 11px; animation-delay: 0.15s; }
.eq i:nth-child(3) { height: 7px; animation-delay: 0.3s; }
.eq i:nth-child(4) { height: 10px; animation-delay: 0.45s; }
@keyframes eq {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
</style>
