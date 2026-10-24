import { ref } from 'vue'

// ---- singleton audio engine (WebAudio, zero asset files, 8-bit flavor) ----
let ac = null
const enabled = ref(false)

function ctx() {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)()
  if (ac.state === 'suspended') ac.resume()
  return ac
}

function tone(freq, dur, { type = 'square', gain = 0.04, at = 0, slideTo = null } = {}) {
  if (!enabled.value) return
  const c = ctx()
  const t0 = c.currentTime + at
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noiseBurst(dur = 0.3, { gain = 0.06, at = 0, freq = 1200 } = {}) {
  if (!enabled.value) return
  const c = ctx()
  const t0 = c.currentTime + at
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = freq
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t0)
}

let lastTypeAt = 0

export function useSound() {
  return {
    enabled,
    toggle() {
      enabled.value = !enabled.value
      if (enabled.value) {
        ctx()
        // power-on chiptune arpeggio
        ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          tone(f, 0.12, { at: i * 0.09, gain: 0.05 })
        )
      }
    },
    // keyboard click while code types
    type() {
      const now = performance.now()
      if (now - lastTypeAt < 34) return
      lastTypeAt = now
      tone(1400 + Math.random() * 900, 0.025, { type: 'square', gain: 0.018 })
    },
    // firework explosion: whistle + crackle
    pop() {
      if (Math.random() > 0.65) return
      tone(500 + Math.random() * 200, 0.35, { type: 'sine', gain: 0.05, slideTo: 90 })
      noiseBurst(0.28, { gain: 0.05, freq: 2400 })
    },
    // rocket launch whistle
    launch() {
      tone(240, 0.5, { type: 'sawtooth', gain: 0.03, slideTo: 900 })
    },
    // program run success
    success() {
      tone(659.25, 0.1, { gain: 0.05 })
      tone(987.77, 0.22, { at: 0.1, gain: 0.05 })
    },
    jingle() {
      ;[784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.14, { at: i * 0.07, gain: 0.045 }))
    }
  }
}
