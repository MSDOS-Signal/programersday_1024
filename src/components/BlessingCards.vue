<template>
  <div class="cards">
    <div
      v-for="(c, i) in cards"
      :key="c.title"
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 80, rotateX: -18 }"
      :visible-once="{ opacity: 1, y: 0, rotateX: 0, transition: { delay: i * 120, duration: 700, type: 'spring', stiffness: 80 } }"
    >
      <div class="card-icon" :style="{ color: c.color }">{{ c.icon }}</div>
      <h3 :style="{ color: c.color }">{{ c.title }}</h3>
      <p class="card-code mono">{{ c.code }}</p>
      <p class="card-text">{{ c.text }}</p>
      <div class="card-glow" :style="{ background: c.color }"></div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  {
    icon: '⚡', color: '#00f0ff', title: '零 Bug 体质',
    code: 'while(alive){ code(); } // no exceptions thrown',
    text: '愿你写下的每一行代码，都一次编译通过，线上永不出 P0。'
  },
  {
    icon: '☕', color: '#ffc857', title: '咖啡永续',
    code: 'coffee.refill(Infinity); sanity.restore();',
    text: '愿你的咖啡永远温热，需求永远清晰，Deadline 永远温柔。'
  },
  {
    icon: '🚀', color: '#ff5ea8', title: '持续交付',
    code: 'git push origin dream --force-with-lease',
    text: '愿你的每次提交都有意义，每个想法都能部署到生产环境。'
  },
  {
    icon: '🧠', color: '#b26bff', title: '灵感满载',
    code: 'brain.cache.hitRate = 100%',
    text: '愿难题在你眼里都是缓存命中，架构图一挥而就。'
  },
  {
    icon: '🌙', color: '#41ff9e', title: '告别熬夜',
    code: 'schedule.shutdown("22:00"); sleep(8h);',
    text: '愿你下班后的时间属于自己，深夜只为热爱而醒。'
  },
  {
    icon: '💎', color: '#ff7a5e', title: '身价暴涨',
    code: 'salary *= 2 ** (skill.years + 1)',
    text: '愿你的价值像指数函数一样增长，Offer 拿到手软。'
  }
]
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.6rem;
  max-width: 1100px;
  margin: 0 auto;
  perspective: 1200px;
}
.card {
  position: relative;
  overflow: hidden;
  padding: 2rem 1.8rem;
  background: rgba(13, 17, 38, 0.72);
  border: 1px solid rgba(120, 140, 255, 0.14);
  border-radius: 14px;
  backdrop-filter: blur(8px);
  transform-style: preserve-3d;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(0, 240, 255, 0.5);
  box-shadow: 0 18px 50px rgba(0, 240, 255, 0.12);
}
.card-icon { font-size: 2.2rem; margin-bottom: 0.6rem; }
h3 { font-size: 1.25rem; margin-bottom: 0.7rem; letter-spacing: 0.08em; }
.card-code {
  font-size: 0.78rem;
  color: var(--neon-green);
  background: rgba(0, 0, 0, 0.45);
  border-left: 3px solid var(--neon-green);
  padding: 0.5em 0.8em;
  border-radius: 4px;
  margin-bottom: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-text { color: var(--text-dim); line-height: 1.8; font-size: 0.92rem; }
.card-glow {
  position: absolute;
  top: -40%;
  right: -20%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  opacity: 0.08;
  filter: blur(50px);
  pointer-events: none;
}
</style>
