// CDP screenshot tool: real-time waits, selector-anchored multi-section captures.
// Usage: node tools/shoot.mjs [url] [outDir]
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = process.argv[2] || 'http://127.0.0.1:4173/'
const OUT = process.argv[3] || path.resolve('shots')
const PORT = 9223

const sleep = ms => new Promise(r => setTimeout(r, ms))

const edge = spawn(EDGE, [
  '--headless=new',
  '--remote-debugging-port=' + PORT,
  '--enable-unsafe-swiftshader',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--window-size=1440,900',
  '--no-first-run',
  'about:blank'
], { stdio: 'ignore' })

let ws, msgId = 0
const pending = new Map()
let sessionId = null

function send(method, params = {}, useSession = true) {
  return new Promise((resolve, reject) => {
    const id = ++msgId
    pending.set(id, { resolve, reject })
    const msg = { id, method, params }
    if (useSession && sessionId) msg.sessionId = sessionId
    ws.send(JSON.stringify(msg))
  })
}

async function main() {
  let version = null
  for (let i = 0; i < 40; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()
      break
    } catch { await sleep(250) }
  }
  if (!version) throw new Error('devtools endpoint not reachable')

  ws = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise(r => { ws.onopen = r })
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data)
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id)
      pending.delete(m.id)
      m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result)
    }
  }

  const { targetId } = await send('Target.createTarget', { url: URL }, false)
  const att = await send('Target.attachToTarget', { targetId, flatten: true }, false)
  sessionId = att.sessionId

  await send('Page.enable')
  await send('Runtime.enable')

  async function shot(name) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(path.join(OUT, name), Buffer.from(data, 'base64'))
    console.log('saved', name)
  }

  async function scrollToEl(sel) {
    await send('Runtime.evaluate', {
      expression: `(() => { const el = document.querySelector(${JSON.stringify(sel)});
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'instant' }); })()`
    })
  }

  await sleep(6500)
  await shot('01-hero.png')

  const stops = [
    ['02-ascii.png', '.ascii-section', 3000],
    ['03-rain.png', '.rain-banner', 1200],
    ['04-typer.png', '.typer-window', 19000],
    ['05-cards.png', '.cards', 1600],
    ['06-stats.png', '.stats', 2500],
    ['07-fireworks.png', '.fw-stage', 4500],
    ['08-footer.png', '.footer', 1500]
  ]
  for (const [name, sel, wait] of stops) {
    await scrollToEl(sel)
    await sleep(wait)
    await shot(name)
  }

  edge.kill()
  process.exit(0)
}

main().catch(e => { console.error(e); edge.kill(); process.exit(1) })
