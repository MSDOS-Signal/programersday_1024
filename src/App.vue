<template>
  <BackgroundField />
  <SoundToggle />

  <main class="page">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <p class="tag" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        OCT&nbsp;24&nbsp;·&nbsp;PROGRAMMER'S&nbsp;DAY
      </p>

      <h1 class="glitch" data-text="程序员节快乐">程序员节快乐</h1>

      <div class="particle-stage">
        <ParticleText text="1024" />
      </div>

      <p class="typewriter mono">
        <span class="prompt">$</span> {{ display }}<span class="cursor" :class="{ on: cursorVisible }">▌</span>
      </p>

      <div class="hero-hint mono" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 1800, duration: 900 } }">
        <span>移动鼠标 → 拨乱粒子</span>
        <span class="dot">·</span>
        <span>右上角开启音效</span>
        <span class="dot">·</span>
        <span>向下滚动 → 收下祝福</span>
      </div>

      <div class="px-corner px-tl" v-motion :initial="{ opacity: 0, scale: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 900, duration: 500, type: 'spring', bounce: 0.5 } }">
        <PixelSprite v-bind="ROCKET" :px="6" />
      </div>
      <div class="px-corner px-tr" v-motion :initial="{ opacity: 0, scale: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 1100, duration: 500, type: 'spring', bounce: 0.5 } }">
        <PixelSprite v-bind="HEART" :px="7" />
      </div>
      <div class="px-corner px-bl" v-motion :initial="{ opacity: 0, scale: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 1300, duration: 500, type: 'spring', bounce: 0.5 } }">
        <PixelSprite v-bind="COFFEE" :px="5" />
      </div>
      <div class="px-corner px-br" v-motion :initial="{ opacity: 0, scale: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 1500, duration: 500, type: 'spring', bounce: 0.5 } }">
        <PixelSprite v-bind="GHOST" :px="6" />
      </div>

      <div class="scroll-cue" aria-hidden="true"><span></span></div>
    </section>

    <!-- ============ 跑马灯 ============ -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track mono">
        <span v-for="i in 2" :key="i">
          HACK <em>·</em> CODE <em>·</em> SHIP <em>·</em> 1024 <em>·</em> BUG-FREE <em>·</em> 程序员节 <em>·</em>
          HELLO WORLD <em>·</em> COMMIT <em>·</em> PUSH <em>·</em> DEPLOY <em>·</em> 节日快乐 <em>·</em>&nbsp;
        </span>
      </div>
    </div>

    <!-- ============ ASCII 字符画 ============ -->
    <section class="section grid-bg ascii-section">
      <AsciiArt :art="figlet" />
    </section>

    <!-- ============ 代码雨横幅 ============ -->
    <section class="rain-banner">
      <CodeRain />
      <div class="rain-overlay">
        <h2 v-motion :initial="{ opacity: 0, scale: 0.7 }" :visible-once="{ opacity: 1, scale: 1, transition: { duration: 800, type: 'spring', bounce: 0.4 } }">
          <span class="neon-text">01011001 01101111 01110101</span>
        </h2>
        <p class="mono rain-sub">// 翻译成人类语言：you —— 每一位程序员，节日快乐</p>
      </div>
    </section>

    <!-- ============ 代码打字机 ============ -->
    <section class="section grid-bg">
      <h2 class="section-title" v-motion :initial="{ opacity: 0, y: 40 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 700 } }">
        <span class="mono hash">##</span> 今日特供脚本 <span class="mono hash">##</span>
      </h2>
      <p class="section-sub mono">vim day_1024.js —— 现场手写，现场运行（点击窗口可重跑）</p>
      <div v-motion :initial="{ opacity: 0, y: 60 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }">
        <CodeTyper />
      </div>
      <div class="typer-deco">
        <PixelSprite v-bind="FLOPPY" :px="5" />
      </div>
    </section>

    <!-- ============ 祝福卡片 ============ -->
    <section class="section">
      <h2 class="section-title" v-motion :initial="{ opacity: 0, y: 40 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 700 } }">
        <span class="mono hash">##</span> 六份打包好的祝福 <span class="mono hash">##</span>
      </h2>
      <p class="section-sub mono">npm install happiness --save</p>
      <BlessingCards />
    </section>

    <!-- ============ 数据面板 ============ -->
    <section class="section grid-bg">
      <h2 class="section-title" v-motion :initial="{ opacity: 0, y: 40 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 700 } }">
        <span class="mono hash">##</span> 今日运行时状态 <span class="mono hash">##</span>
      </h2>
      <p class="section-sub mono">systemctl status programmer.service ● active (running)</p>
      <StatsCounter />
    </section>

    <!-- ============ 烟花 ============ -->
    <section class="fireworks-section">
      <div class="fw-header">
        <h2 class="section-title"><span class="mono hash">##</span> 为你放的烟花 <span class="mono hash">##</span></h2>
        <p class="section-sub mono">./celebrate.sh --mode=fireworks &nbsp;·&nbsp; 点击夜空任意位置手动发射</p>
      </div>
      <div class="fw-stage">
        <Fireworks />
      </div>
    </section>

    <!-- ============ 页脚 ============ -->
    <footer class="footer">
      <pre class="footer-code mono">{{ footerCode }}</pre>
      <p class="footer-line">愿世界对你 <span class="neon-text">温柔编译</span> · 1024 程序员节</p>
      <p class="footer-dim mono">Built with Vue 3 · Three.js · tsParticles · animejs · motion · canvas · WebAudio</p>
    </footer>
  </main>
</template>

<script setup>
import BackgroundField from './components/BackgroundField.vue'
import ParticleText from './components/ParticleText.vue'
import CodeRain from './components/CodeRain.vue'
import BlessingCards from './components/BlessingCards.vue'
import StatsCounter from './components/StatsCounter.vue'
import Fireworks from './components/Fireworks.vue'
import SoundToggle from './components/SoundToggle.vue'
import AsciiArt from './components/AsciiArt.vue'
import CodeTyper from './components/CodeTyper.vue'
import PixelSprite from './components/PixelSprite.vue'
import { HEART, COFFEE, ROCKET, FLOPPY, GHOST } from './art/pixel'
import { useTypewriter } from './composables/useTypewriter'

const { display, cursorVisible } = useTypewriter([
  'echo "Hello World, Hello Future!"',
  'while (true) { keepCoding(); stayCurious(); }',
  'sudo give --blessing to=all_programmers',
  'console.log("1024 程序员节快乐 🎉")',
  'commit -m "feat: 又长大了一岁的热爱"'
], { typeSpeed: 65 })

const figlet = `
██╗ ██████╗ ██████╗ ██╗  ██╗
███║██╔═████╗╚════██╗██║  ██║
╚██║██║██╔██║ █████╔╝███████║
 ██║████╔╝██║██╔═══╝ ╚════██║
 ██║╚██████╔╝███████╗     ██║
 ╚═╝ ╚═════╝ ╚══════╝     ╚═╝`

const footerCode =
`if (you.isProgrammer()) {
  universe.grant([ 'bug-free', 'coffee', 'inspiration', 'promotion' ]);
}
// exit code: 0  ——  一切顺利`
</script>

<style scoped>
.page { position: relative; z-index: 1; }

/* ---------- hero ---------- */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4vh 5vw 8vh;
  text-align: center;
}
.tag { margin-bottom: 1.2rem; }

.glitch {
  position: relative;
  font-size: clamp(2.4rem, 7vw, 5.2rem);
  font-weight: 900;
  letter-spacing: 0.12em;
  color: var(--text);
  text-shadow: 0 0 30px rgba(0, 240, 255, 0.35);
  margin-bottom: 1vh;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.glitch::before {
  color: var(--neon-cyan);
  animation: glitch-a 2.8s infinite linear alternate-reverse;
  clip-path: inset(20% 0 60% 0);
}
.glitch::after {
  color: var(--neon-pink);
  animation: glitch-b 3.4s infinite linear alternate-reverse;
  clip-path: inset(60% 0 15% 0);
}
@keyframes glitch-a {
  0% { transform: translate(0); clip-path: inset(20% 0 60% 0); }
  20% { transform: translate(-4px, 2px); clip-path: inset(50% 0 30% 0); }
  40% { transform: translate(3px, -2px); clip-path: inset(10% 0 75% 0); }
  60% { transform: translate(-2px, 1px); clip-path: inset(65% 0 10% 0); }
  80% { transform: translate(4px, -1px); clip-path: inset(30% 0 45% 0); }
  100% { transform: translate(0); clip-path: inset(20% 0 60% 0); }
}
@keyframes glitch-b {
  0% { transform: translate(0); clip-path: inset(60% 0 15% 0); }
  25% { transform: translate(4px, 1px); clip-path: inset(15% 0 70% 0); }
  50% { transform: translate(-3px, -2px); clip-path: inset(45% 0 35% 0); }
  75% { transform: translate(2px, 2px); clip-path: inset(70% 0 8% 0); }
  100% { transform: translate(0); clip-path: inset(60% 0 15% 0); }
}

.particle-stage {
  width: min(92vw, 980px);
  height: clamp(200px, 34vh, 330px);
  margin: 1vh 0;
}

.typewriter {
  min-height: 1.8em;
  font-size: clamp(0.95rem, 2.4vw, 1.3rem);
  color: var(--neon-green);
  text-shadow: 0 0 14px rgba(65, 255, 158, 0.45);
}
.prompt { color: var(--neon-pink); margin-right: 0.5em; }
.cursor { opacity: 0; transition: opacity 0.1s; }
.cursor.on { opacity: 1; }

.hero-hint {
  margin-top: 2.2rem;
  color: var(--text-dim);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}
.hero-hint .dot { margin: 0 0.8em; color: var(--neon-purple); }

/* pixel corners */
.px-corner {
  position: absolute;
  z-index: 3;
  filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.2));
  animation: px-float 4s ease-in-out infinite;
}
.px-tl { top: 12%; left: 7%; }
.px-tr { top: 10%; right: 8%; animation-delay: 0.8s; }
.px-bl { bottom: 14%; left: 10%; animation-delay: 1.6s; }
.px-br { bottom: 16%; right: 7%; animation-delay: 2.4s; }
@keyframes px-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@media (max-width: 900px) { .px-corner { display: none; } }

.scroll-cue {
  position: absolute;
  bottom: 3.5vh;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 44px;
  border: 2px solid rgba(139, 147, 184, 0.5);
  border-radius: 14px;
}
.scroll-cue span {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 9px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--neon-cyan);
  animation: cue 1.6s infinite;
}
@keyframes cue {
  0% { transform: translateY(0); opacity: 1; }
  70% { transform: translateY(16px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

/* ---------- marquee ---------- */
.marquee {
  overflow: hidden;
  border-top: 1px solid rgba(120, 140, 255, 0.18);
  border-bottom: 1px solid rgba(120, 140, 255, 0.18);
  padding: 0.9rem 0;
  background: rgba(10, 13, 28, 0.6);
  backdrop-filter: blur(4px);
}
.marquee-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  font-size: 0.95rem;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  animation: marquee 26s linear infinite;
}
.marquee-track em {
  font-style: normal;
  color: var(--neon-purple);
  margin: 0 0.6em;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ---------- ascii ---------- */
.ascii-section { padding-top: 12vh; padding-bottom: 12vh; }

/* ---------- grid bg (OpenAI / hackathon vibe) ---------- */
.grid-bg {
  background-image:
    linear-gradient(rgba(120, 140, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 140, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  background-position: center;
}

/* ---------- code rain banner ---------- */
.rain-banner {
  position: relative;
  height: 46vh;
  min-height: 320px;
  overflow: hidden;
  border-top: 1px solid rgba(65, 255, 158, 0.18);
  border-bottom: 1px solid rgba(65, 255, 158, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.rain-overlay {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 1.5rem 2.5rem;
  background: rgba(5, 8, 18, 0.55);
  border-radius: 12px;
  backdrop-filter: blur(3px);
}
.rain-overlay h2 {
  font-size: clamp(1.2rem, 4vw, 2.4rem);
  letter-spacing: 0.1em;
}
.rain-sub { margin-top: 0.9rem; color: var(--neon-green); font-size: 0.9rem; }

/* ---------- generic section ---------- */
.section { padding: 14vh 5vw; text-align: center; }
.section-title {
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  letter-spacing: 0.1em;
}
.hash { color: var(--neon-purple); opacity: 0.7; font-size: 0.8em; }
.section-sub { color: var(--text-dim); margin: 0.9rem 0 3.5rem; font-size: 0.85rem; }

.typer-deco {
  margin-top: 2.6rem;
  display: flex;
  justify-content: center;
  opacity: 0.85;
}

/* ---------- fireworks ---------- */
.fireworks-section {
  padding: 12vh 0 0;
}
.fw-header { text-align: center; padding: 0 5vw; }
.fw-stage {
  margin-top: 3rem;
  height: 62vh;
  min-height: 420px;
  border-top: 1px solid rgba(178, 107, 255, 0.2);
  background: radial-gradient(ellipse at 50% 120%, rgba(178, 107, 255, 0.12), transparent 60%);
}

/* ---------- footer ---------- */
.footer {
  padding: 10vh 5vw 8vh;
  text-align: center;
  border-top: 1px solid rgba(120, 140, 255, 0.12);
}
.footer-code {
  display: inline-block;
  text-align: left;
  font-size: clamp(0.75rem, 2vw, 0.95rem);
  line-height: 1.9;
  color: var(--neon-cyan);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 10px;
  padding: 1.4rem 2rem;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.08);
}
.footer-line { margin-top: 2.4rem; font-size: 1.1rem; letter-spacing: 0.15em; }
.footer-dim { margin-top: 1rem; color: var(--text-dim); font-size: 0.72rem; letter-spacing: 0.1em; }

@media (max-width: 640px) {
  .card-code { white-space: normal; }
  .hero-hint { letter-spacing: 0.08em; }
}
</style>