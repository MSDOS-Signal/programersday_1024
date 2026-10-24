<template>
  <div ref="root" class="typer-window">
    <div class="typer-titlebar">
      <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      <span class="typer-file mono">day_1024.js — hackathon@localhost</span>
      <button class="rerun mono" @click="restart" title="重新运行">↻ rerun</button>
    </div>
    <div class="typer-body mono" @click="restart">
      <template v-for="(line, li) in renderLines" :key="li">
        <div class="tline">
          <span class="ln">{{ li + 1 }}</span>
          <span v-for="(tok, ti) in line" :key="ti" :class="'tk-' + tok.c">{{ tok.t }}</span><span
            v-if="li === cursorLine && phase === 'code'"
            class="caret"
          >▌</span>
        </div>
      </template>

      <div v-if="phase === 'run' || phase === 'done'" class="output">
        <div v-for="(o, oi) in renderOutput" :key="o" class="oline">
          <span :class="o.startsWith('✔') ? 'ok' : o.startsWith('>') ? 'cmd' : 'dim'">{{ o }}</span>
          <span v-if="oi === renderOutput.length - 1 && phase === 'run'" class="caret">▌</span>
        </div>
        <div v-if="phase === 'done'" class="oline ok glow-line">exit code: 0 —— 一切顺利，节日快乐</div>
      </div>
    </div>
    <div class="scanlines" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSound } from '../composables/useSound'

const sound = useSound()

// tokenized source: [text, class]
const CODE = [
  [['// day_1024.js —— 今日特供脚本', 'com']],
  [],
  [['const ', 'kw'], ['me', 'var'], [' = ', 'op'], ['new ', 'kw'], ['Programmer', 'cls'], ['(', 'pun'], ["'你'", 'str'], [');', 'pun']],
  [['me', 'var'], ['.', 'pun'], ['equip', 'fn'], ['([', 'pun'], ["'机械键盘'", 'str'], [', ', 'pun'], ["'咖啡 x3'", 'str'], [', ', 'pun'], ["'降噪耳机'", 'str'], [']);', 'pun']],
  [],
  [['while', 'kw'], [' (', 'pun'], ['me', 'var'], ['.', 'pun'], ['awake', 'var'], [') {', 'pun']],
  [['  me', 'var'], ['.', 'pun'], ['code', 'fn'], ['();', 'pun']],
  [['  if', 'kw'], [' (', 'pun'], ['me', 'var'], ['.', 'pun'], ['stuck', 'var'], [') ', 'pun'], ['me', 'var'], ['.', 'pun'], ['ask', 'fn'], ['(', 'pun'], ["'AI'", 'str'], [');', 'pun']],
  [['}', 'pun']],
  [],
  [['me', 'var'], ['.', 'pun'], ['on', 'fn'], ['(', 'pun'], ["'1024'", 'str'], [', () ', 'kw'], ['=> {', 'pun']],
  [['  world', 'var'], ['.', 'pun'], ['celebrate', 'fn'], ['({ ', 'pun'], ['fireworks', 'var'], [': ', 'op'], ['true', 'kw'], [', ', 'pun'], ['bugs', 'var'], [': ', 'op'], ['0', 'num'], [' });', 'pun']],
  [['  me', 'var'], ['.', 'pun'], ['happiness', 'var'], [' = ', 'op'], ['Infinity', 'num'], [';', 'pun']],
  [['});', 'pun']]
]

const OUTPUT = [
  '> node day_1024.js',
  '✔ 编译通过 · 0 errors · 0 warnings',
  '✔ 装备检查完毕：键盘手感极佳',
  '✔ 烟花已升空，全服广播祝福',
  '✔ happiness = Infinity（溢出也不管）'
]

// flatten to chars with class
const FLAT = []
CODE.forEach((line, li) => {
  line.forEach(([t, c]) => { for (const ch of t) FLAT.push({ ch, c, li }) })
  if (li < CODE.length - 1) FLAT.push({ ch: '\n', c: 'pun', li })
})

const totalChars = FLAT.length
const typed = ref(0)
const outTyped = ref(0)
const phase = ref('idle') // idle | code | run | done
const root = ref(null)
let timer = 0, observer = null

const renderLines = computed(() => {
  const lines = []
  let cur = []
  let curLi = 0
  const pushLine = () => { lines.push(cur); cur = [] }
  for (let i = 0; i < typed.value && i < totalChars; i++) {
    const { ch, c, li } = FLAT[i]
    while (curLi < li) { pushLine(); curLi++ }
    if (ch === '\n') { pushLine(); curLi++; continue }
    const last = cur[cur.length - 1]
    if (last && last.c === c) last.t += ch
    else cur.push({ t: ch, c })
  }
  while (lines.length < CODE.length && curLi < CODE.length) { lines.push(cur); cur = []; curLi++ }
  return lines
})

const cursorLine = computed(() => {
  if (typed.value >= totalChars) return -1
  return FLAT[Math.min(typed.value, totalChars - 1)].li
})

const renderOutput = computed(() => OUTPUT.slice(0, outTyped.value))

function step() {
  clearTimeout(timer)
  if (phase.value === 'code') {
    if (typed.value < totalChars) {
      typed.value++
      sound.type()
      const ch = FLAT[typed.value - 1]?.ch
      const delay = ch === '\n' ? 120 : /[\u4e00-\u9fff]/.test(ch) ? 55 : 18 + Math.random() * 40
      timer = setTimeout(step, delay)
    } else {
      phase.value = 'run'
      timer = setTimeout(step, 700)
    }
  } else if (phase.value === 'run') {
    if (outTyped.value < OUTPUT.length) {
      outTyped.value++
      sound.type()
      timer = setTimeout(step, 420)
    } else {
      phase.value = 'done'
      sound.success()
    }
  }
}

function restart() {
  clearTimeout(timer)
  typed.value = 0
  outTyped.value = 0
  phase.value = 'code'
  timer = setTimeout(step, 300)
}

onMounted(() => {
  observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting && phase.value === 'idle') {
      phase.value = 'code'
      timer = setTimeout(step, 400)
      observer.disconnect()
    }
  }), { threshold: 0.35 })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  observer?.disconnect()
})
</script>

<style scoped>
.typer-window {
  position: relative;
  max-width: 780px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #0a0d1c;
  border: 1px solid rgba(120, 140, 255, 0.22);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), 0 0 60px rgba(0, 240, 255, 0.06);
  text-align: left;
}
.typer-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(120, 140, 255, 0.15);
}
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.r { background: #ff5f57; }
.dot.y { background: #febc2e; }
.dot.g { background: #28c840; }
.typer-file { margin-left: 10px; color: var(--text-dim); font-size: 0.78rem; flex: 1; }
.rerun {
  font-family: inherit;
  font-size: 0.72rem;
  color: var(--neon-cyan);
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.35);
  border-radius: 4px;
  padding: 2px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.rerun:hover { background: rgba(0, 240, 255, 0.12); }
.typer-body {
  padding: 1.1rem 1.2rem 1.4rem;
  font-size: clamp(0.72rem, 1.9vw, 0.92rem);
  line-height: 1.75;
  min-height: 340px;
  cursor: pointer;
}
.tline { white-space: pre-wrap; word-break: break-all; }
.ln {
  display: inline-block;
  width: 2.2em;
  margin-right: 1em;
  text-align: right;
  color: #3d4566;
  user-select: none;
}
.caret { color: var(--neon-green); animation: blink 0.9s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.tk-kw { color: #ff5ea8; }
.tk-var { color: #8fd3ff; }
.tk-fn { color: #ffc857; }
.tk-str { color: #41ff9e; }
.tk-num { color: #b26bff; }
.tk-cls { color: #00f0ff; }
.tk-com { color: #525b80; font-style: italic; }
.tk-op, .tk-pun { color: #aab2d8; }

.output { margin-top: 1rem; border-top: 1px dashed rgba(120, 140, 255, 0.25); padding-top: 0.8rem; }
.oline { line-height: 2; }
.cmd { color: var(--neon-cyan); }
.ok { color: var(--neon-green); }
.dim { color: var(--text-dim); }
.glow-line { text-shadow: 0 0 16px rgba(65, 255, 158, 0.5); }

.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px);
  mix-blend-mode: overlay;
}
</style>
